import { JwtPayload } from 'jsonwebtoken';
import Car from '../car/car.model';

import Order from './order.model';
import AppError from '../../errors/AppError';
import { orderUtils } from './order.utils';

const getAllOrdersFromDB = async () => {
  return await Order.find().populate('car');
};

const createOrderInDB = async (
  user: JwtPayload,
  payload: { cars: { car: string; quantity: number }[] },
  client_ip: string
) => {
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
    user,
    products: carDetails,
    totalPrice,
  });

  // payment integration
  const shurjopayPayload = {
    amount: totalPrice,
    order_id: order._id,
    currency: 'BDT',
    customer_name: user?.name,
    customer_address: user?.address,
    customer_email: user.email,
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
  const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id);

  if (verifiedPayment.length) {
    await Order.findOneAndUpdate(
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
      }
    );

    const order = await Order.findById(order_id);
    if (!order) {
      throw new AppError(404, 'Order not found');
    }

    // Iterate through cars and update their stock
    await Promise.all(
      order.cars.map(async (orderCar) => {
        await Car.updateOne(
          { _id: orderCar.car }, // Find car by ID
          { $inc: { quantity: -orderCar.quantity } } // Reduce quantity
        );
      })
    );
  }

  return verifiedPayment;
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
  claculateRevenueFromDB,
  verifyPayment,
};
