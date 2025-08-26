import { JwtPayload } from 'jsonwebtoken';
import Car from '../car/car.model';

import Order from './order.model';
import AppError from '../../errors/AppError';
import { orderUtils } from './order.utils';
import User from '../user/user.model';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';

const getAllOrdersFromDB = async (query: Record<string, unknown>) => {
  const ordersQuery = new QueryBuilder(
    Order.find().populate({ path: 'cars.car', model: 'Car' }).populate({
      path: 'user',
      model: 'User',
      select: 'name email address city img profileImg phone',
    }),
    query
  )
    .search(['name', 'email', 'status'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await ordersQuery.countTotal();
  const result = await ordersQuery.modelQuery;

  return {
    meta,
    result,
  };
};

const getAllCustomerAndOrdersFromDB = async () => {
  const now = new Date();

  // current month starta and end
  const curMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const curMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  // prev month starta and end
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthEnd = new Date(
    now.getFullYear(),
    now.getMonth(),
    0,
    23,
    59,
    59
  );

  const curOrders = await Order.find({
    createdAt: { $gte: curMonthStart, $lte: curMonthEnd },
  }).lean();

  const prevOrders = await Order.find({
    createdAt: { $gte: prevMonthStart, $lte: prevMonthEnd },
  }).lean();

  const curCustomers = await User.find({
    createdAt: { $gte: curMonthStart, $lte: curMonthEnd },
  }).lean();

  const prevCustomers = await User.find({
    createdAt: { $gte: prevMonthStart, $lte: prevMonthEnd },
  }).lean();

  const calculatePercentageChange = (cur: number, prev: number) => {
    if (!prev || prev === 0) return 0;
    return parseFloat((((cur - prev) / prev) * 100).toFixed(2));
  };

  const customerChange = calculatePercentageChange(
    curCustomers.length,
    prevCustomers.length
  );
  const orderChange = calculatePercentageChange(
    curOrders.length,
    prevOrders.length
  );

  return {
    cur: {
      orders: curOrders,
      customers: curCustomers,
    },
    prev: {
      orders: prevOrders,
      customers: prevCustomers,
    },
    analytics: {
      customerChange,
      orderChange,
      customerGrowth: customerChange >= 0 ? 'positive' : 'negative',
      orderGrowth: orderChange >= 0 ? 'positive' : 'negative',
    },
  };
};

const getMyOrdersFromDB = async (
  query: Record<string, unknown>,
  userData: JwtPayload
) => {
  const user = await User.findOne({
    email: userData.email,
    role: userData.role,
  }).lean();

  if (!user) throw new AppError(403, 'User not found');

  const ordersQuery = new QueryBuilder(
    Order.find({ user: user._id })
      .populate({ path: 'cars.car', model: 'Car' })
      .populate({
        path: 'user',
        model: 'User',
        select: 'name email address city img profileImg phone',
      }),
    query
  )
    .search(['name', 'email', 'status'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await ordersQuery.countTotal();
  const result = await ordersQuery.modelQuery;

  return {
    meta,
    result,
  };
};

const createOrderInDB = async (
  userData: JwtPayload,
  payload: { cars: { car: string; quantity: number }[] },
  client_ip: string
) => {
  const user = await User.findOne({
    email: userData.email,
    role: userData.role,
  }).lean();

  if (!payload?.cars?.length) throw new AppError(400, 'Order is not specified');

  const cars = payload.cars;

  let totalPrice = 0;

  const carDetails = await Promise.all(
    cars.map(async (item, index) => {
      const car = await Car.findById(item.car);
      if (car && car.isDeleted)
        throw new Error('You can not order a deleted car!');

      if (car && car.quantity < payload.cars[index].quantity)
        throw new Error('Insufficinet stock for this car!');

      if (car) {
        const subtotal = car ? (car.price || 0) * item.quantity : 0;
        totalPrice += subtotal;
        return item;
      } else
        throw new AppError(400, 'The car following this id does not exist');
    })
  );

  let order = await Order.create({
    user: user?._id,
    cars: carDetails,
    totalPrice,
  });

  // payment integration
  const shurjopayPayload = {
    amount: totalPrice,
    order_id: order._id,
    currency: 'BDT',
    customer_name: user?.name,
    customer_address: user?.address,
    customer_email: user?.email,
    customer_phone: user?.phone,
    customer_city: user?.country,
    client_ip,
  };

  const payment = await orderUtils.makePaymentAsync(shurjopayPayload);

  if (payment?.transactionStatus) {
    order = await order.updateOne({
      transaction: {
        id: payment.sp_order_id,
        transactionStatus: payment.transactionStatus,
      },
    });
  }

  return payment.checkout_url;
};

const verifyPayment = async (order_id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id);

    if (!verifiedPayment.length)
      throw new AppError(400, 'Payment verification failed');

    const order = await Order.findOneAndUpdate(
      {
        'transaction.id': order_id,
      },
      {
        'transaction.bank_status': verifiedPayment[0].bank_status,
        'transaction.sp_code': verifiedPayment[0].sp_code,
        'transaction.sp_message': verifiedPayment[0].sp_message,
        'transaction.transactionStatus': verifiedPayment[0].transaction_status,
        'transaction.method': verifiedPayment[0].method,
        'transaction.date_time': verifiedPayment[0].date_time,
        status:
          verifiedPayment[0].bank_status == 'Success'
            ? 'PAID'
            : verifiedPayment[0].bank_status == 'Failed'
            ? 'PENDING'
            : verifiedPayment[0].bank_status == 'Cancel'
            ? 'CANCELLED'
            : '',
      },
      {
        new: true,
        session,
      }
    );

    if (!order) {
      throw new AppError(404, 'Order not found');
    }

    for (const orderCar of order.cars) {
      const car = await Car.findById(orderCar.car).session(session);

      if (!car) throw new AppError(404, 'Car not found');

      if (!car.inStock)
        throw new AppError(400, `Car ${car.model} is out of stock`);

      if (orderCar.quantity > car.quantity) {
        throw new AppError(400, `Not enough stock for ${car.model}`);
      }
    }

    // Iterate through cars and update their stock
    await Promise.all(
      order.cars.map(async (orderCar) => {
        const updatedCar = await Car.findOneAndUpdate(
          { _id: orderCar.car }, // Find car by ID
          { $inc: { quantity: -orderCar.quantity } }, // Reduce quantity
          { new: true, session }
        );

        if (updatedCar && updatedCar.quantity === 0) {
          await Car.findByIdAndUpdate(
            orderCar.car,
            { inStock: false },
            { session }
          );
        }
      })
    );

    await session.commitTransaction();
    session.endSession();

    return verifiedPayment;
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();

    throw new AppError(400, err.message);
  }
};

const deleteAnOrder = async (id: string) => {
  return await Order.findByIdAndDelete(id);
};

const updateAnOrder = async (id: string) => {
  const orders = await Order.findById(id);

  if (orders?.status === 'PAID') {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status: 'COMPLETED' },
      { new: true }
    );

    if (!updatedOrder) throw new AppError(400, 'Order not found!');
  } else {
    throw new AppError(400, 'You can not change status!');
  }
};

const claculateRevenueFromDB = async () => {
  return await Order.aggregate([
    // FINDING CARS FROM CARS COLLECTION
    {
      $lookup: {
        from: 'cars',
        localField: 'car',
        foreignField: '_id',
        as: 'carDetails',
      },
    },
    // FLATTENING CARS ARRAY

    {
      $unwind: '$carDetails',
    },

    //  CALCULATING PRICE BY QUANTITY FOR EACH CAR
    {
      $addFields: {
        carPriceByQt: {
          $multiply: ['$carDetails.quantity', '$carDetails.price'],
        },
      },
    },

    // GROUPING ALL DOCUMENTS
    {
      $group: {
        _id: null,
        // CALCULATING TOTAL REVENUE
        totalRevenue: { $sum: '$carPriceByQt' },
      },
    },
    {
      $project: {
        _id: 0,
        totalRevenue: 1,
      },
    },
  ]).exec();
};

const getMonthlySalesFromDB = async () => {
  const curYear = new Date().getFullYear();

  // GROUPING ORDERS BY MONTH
  const monthlySales = await Order.aggregate([
    // staget 1
    {
      $match: {
        createdAt: {
          $gte: new Date(`${curYear}-01-01`),
          $lte: new Date(`${curYear}-12-31`),
        },
      },
    },
    // stage 2
    {
      $group: {
        _id: {
          $month: '$createdAt',
        },
        totalSales: { $sum: 1 },
        totalRevenue: { $sum: '$totalAmount' },
        totalQuantity: { $sum: '$quantity' },
      },
    },
    //stage-3
    {
      $sort: { _id: 1 },
    },
  ]);

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const completeYearData = monthNames.map((month, index) => {
    const monthData = monthlySales.find((item) => item._id === index + 1);

    return {
      month,
      sales: monthData ? monthData.totalSales : 0,
      revenue: monthData ? monthData.totalRevenue : 0,
      quantity: monthData ? monthData.totalQuantity : 0,
    };
  });

  return completeYearData;
};

const getMonthlyTargetFromDB = async () => {
  const now = new Date();
  const curYear = now.getFullYear();
  const curMonth = now.getMonth();

  const curMonthStart = new Date(curYear, curMonth, 1);
  const curMonthEnd = new Date(curYear, curMonth + 1, 0, 23, 59, 59);

  const prevMonthStart = new Date(curYear, curMonth - 1, 1);
  const prevMonthEnd = new Date(curYear, curMonth, 0, 23, 59, 59);

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59
  );

  // GET CURRENT MONTH REVENUE
  const curMonthOrders = await Order.aggregate([
    // 1st stage
    {
      $match: {
        createdAt: {
          $gte: curMonthStart,
          $lte: curMonthEnd,
        },
        status: 'COMPLETED',
      },
    },

    // 2nd stage
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalAmount' },
        totalOrders: { $sum: 1 },
      },
    },
  ]);

  // GET PREVIOUS MONT REVENUE

  const prevMonthOrders = await Order.aggregate([
    // 1st stage
    {
      $match: {
        createdAt: {
          $gte: prevMonthStart,
          $lte: prevMonthEnd,
        },
        status: 'COMPLETED',
      },
    },

    // 2nd stage
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalAmount' },
      },
    },
  ]);

  // GET TODAYS REVENUE

  const toadaysOrders = await Order.aggregate([
    // 1st stage
    {
      $match: {
        createdAt: {
          $gte: todayStart,
          $lte: todayEnd,
        },
      },
    },

    // 2nd stage
    {
      $group: {
        _id: null,
        totalRevnue: { $sum: '$totalAmount' },
      },
    },
  ]);

  const monthlyTarget = 200000; // hardcoded value

  // EXTRACT VALUES
  const curRevenue = curMonthOrders[0]?.totalRevenue || 0;
  const prevRevenue = prevMonthOrders[0]?.totalRevenue || 0;
  const todayRevenue = toadaysOrders[0]?.totalRevnue || 0;

  // CALCULATE PROGRESS PERCENTAGE
  const progressPercentage =
    monthlyTarget > 0 ? Math.min((curRevenue / monthlyTarget) * 100, 100) : 0;

  // CALCULATE MONTH-OVER-MONTH GROWTH
  const growthPercentage =
    prevRevenue > 0 ? ((curRevenue - prevRevenue) / prevRevenue) * 100 : 0;

  // GENERATE DYNAMIC MESSAGE
  const generateMessage = (
    todayRev: number,
    growth: number,
    isPositive: boolean
  ) => {
    const formattedToday = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(todayRev);

    if (isPositive) {
      return `You earned ${formattedToday} today, it's ${Math.abs(
        growth
      ).toFixed(1)}% higher than last month. Keep your good work`;
    } else if (growth < 0) {
      return `You earned ${formattedToday} today, it's ${Math.abs(
        growth
      ).toFixed(1)}% lower than last month. Let's work harder!`;
    } else {
      return `You earned ${formattedToday} today. Keep pushing towards your monthly target!`;
    }
  };

  const isGrowthPositive = growthPercentage > 0;

  return {
    targetAmount: monthlyTarget,
    curRevenue: Math.round(curRevenue),
    todayRevenue: Math.round(todayRevenue),
    progressPercentage: Math.round(progressPercentage * 100) / 100,
    growthPercentage: Math.round(Math.abs(growthPercentage)),
    message: generateMessage(todayRevenue, growthPercentage, isGrowthPositive),
    additionalStats: {
      curMonthOrders: curMonthOrders[0]?.totalOrders || 0,
      remainingAmount: Math.max(0, monthlyTarget - curRevenue, 0),
      daysInMonth: new Date(curYear, curMonth + 1, 0).getDate(),
      daysPassed: now.getDate(),
      averageDailyRevenue: Math.round(curRevenue / now.getDate()),
    },
  };
};

export const orderServices = {
  getAllOrdersFromDB,
  getAllCustomerAndOrdersFromDB,
  createOrderInDB,
  deleteAnOrder,
  updateAnOrder,
  claculateRevenueFromDB,
  verifyPayment,
  getMyOrdersFromDB,
  getMonthlySalesFromDB,
  getMonthlyTargetFromDB,
};
