import { JwtPayload } from 'jsonwebtoken';
import Car from '../car/car.model';

import Order from './order.model';
import AppError from '../../errors/AppError';
import { orderUtils } from './order.utils';
import User from '../user/user.model';
import mongoose from 'mongoose';
import { IOrder } from './order.interface';
import QueryBuilder from '../../builder/QueryBuilder';

const getAllOrdersFromDB = async (query: Record<string, unknown>) => {
  const ordersQuery = new QueryBuilder(
    Order.find()
      .populate({ path: 'cars.car', model: 'Car' })
      .populate({ path: 'user', model: 'User', select: 'name email' }),
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
    customer_city: user?.city,
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
    console.log(err);
    await session.abortTransaction();
    session.endSession();

    throw new AppError(400, err.message);
  }
};

const deleteAnOrder = async (id: string) => {
  return await Order.findByIdAndDelete(id);
};

const updateAnOrder = async (id: string, payload: Partial<IOrder>) => {
  //FIXME: WE NEED TO UPDATE NESTED OBJECT
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true }
  );

  if (!updatedOrder) throw new AppError(400, 'Order not found!');
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

export const orderServices = {
  getAllOrdersFromDB,
  createOrderInDB,
  deleteAnOrder,
  updateAnOrder,
  claculateRevenueFromDB,
  verifyPayment,
};
