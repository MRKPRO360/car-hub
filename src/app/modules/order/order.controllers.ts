import { Request, Response } from 'express';
import { orderServices } from './order.services';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const result = await orderServices.createOrderInDB(user!, req.body, req.ip!);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Order created successfully!',
    data: result,
  });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await orderServices.getAllOrdersFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order retrieved successfully!',
    data: result.result,
    meta: result.meta,
  });
});

const getAllCustomerAndOrders = catchAsync(
  async (req: Request, res: Response) => {
    const result = await orderServices.getAllCustomerAndOrdersFromDB();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Orders and customers retrieved successfully!',
      data: result,
    });
  }
);

const getMonthlySales = catchAsync(async (req: Request, res: Response) => {
  const result = await orderServices.getMonthlySalesFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Monthly sales data retrieved successfully!',
    data: result,
  });
});

const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await orderServices.getMyOrdersFromDB(req.query, req.user!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order retrieved successfully!',
    data: result.result,
    meta: result.meta,
  });
});

const deleteAnOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await orderServices.deleteAnOrder(req.params.orderId);

  sendResponse(res, {
    statusCode: 204,
    success: true,
    message: 'Order deleted successfully!',
    data: result,
  });
});

const updateAnOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await orderServices.updateAnOrder(req.params.orderId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order updated successfully!',
    data: result,
  });
});

const verifyPayment = catchAsync(async (req, res) => {
  const result = await orderServices.verifyPayment(
    req.query.order_id as string
  );

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: 'Order verified successfully',
    data: result,
  });
});

const claculateRevenue = catchAsync(async (req: Request, res: Response) => {
  const result = await orderServices.claculateRevenueFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Revenue calculated successfully!',
    data: result,
  });
});

export const orderControllers = {
  getAllOrders,
  getMyOrders,
  getAllCustomerAndOrders,
  getMonthlySales,
  createOrder,
  claculateRevenue,
  verifyPayment,
  updateAnOrder,
  deleteAnOrder,
};
