import { Request, Response } from 'express';
import { orderServices } from './order.services';
import catchAsync from '../../../utils/catchAsync';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await orderServices.createOrderInDB(req.body);

  res.status(201).json({
    message: 'Order created successfully!',
    success: true,
    data: result,
  });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await orderServices.getAllOrdersFromDB();
  res.status(200).json({
    message: 'Order retrieved successfully!',
    success: true,
    data: result,
  });
});

const claculateRevenue = catchAsync(async (req: Request, res: Response) => {
  const result = await orderServices.claculateRevenueFromDB();

  res.status(200).json({
    message: 'Revenue calculated successfully!',
    status: true,
    success: true,
    data: result,
  });
});

export const orderControllers = {
  getAllOrders,
  createOrder,
  claculateRevenue,
};
