//NOTE: // Fetch an order with the associated car details
// const orderWithCar = await Order.findById(orderId).populate('car');
// console.log(orderWithCar);

//NOTE: BETTER ERROR HANDLING
//  if (error instanceof z.ZodError) {
//    console.error('Validation failed:', error.errors);
//  } else {
//    console.error('Error creating order:', error);
//  }

import { Request, Response } from 'express';
import { orderServices } from './order.services';
import { orderZodSchema } from './order.validation';

const createOrder = async (req: Request, res: Response) => {
  try {
    // FIXME:
    // const validatedData = orderZodSchema.parse(req.body);

    const result = await orderServices.createOrderInDB(req.body);

    res.status(201).json({
      message: 'Order created successfully!',
      success: true,
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      message: err.message || 'Validation failed!',
      success: false,
      error: err,
      stack: err.stack,
    });
  }
};

const getAllOrders = async (req: Request, res: Response) => {
  try {
    const result = await orderServices.getAllOrdersFromDB();
    res.status(200).json({
      message: 'Order retrieved successfully!',
      success: true,
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      message: 'Something went wrong!',
      success: false,
      error: err,
      stack: err.stack,
    });
  }
};

const claculateRevenue = async (req: Request, res: Response) => {
  try {
    const result = await orderServices.claculateRevenueFromDB();

    res.status(200).json({
      message: 'Revenue calculated successfully!',
      status: true,
      success: true,
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      message: 'Something went wrong!',
      success: false,
      error: err,
      stack: err.stack,
    });
  }
};

export const orderControllers = {
  getAllOrders,
  createOrder,
  claculateRevenue,
};
