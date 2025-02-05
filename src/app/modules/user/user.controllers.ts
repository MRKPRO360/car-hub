import { Request, Response } from 'express';
import catchAsync from '../../../utils/catchAsync';
import { UserServices } from './user.services';
import sendResponse from '../../../utils/sendResponse';

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getAllUsersFromDB();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Users retrieved successfully!',
    data: result,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getMeFromDB(req.user!);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'User retrieved successfully!',
    data: result,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getSingleUserFromDB(req.params.userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'User retrieved successfully!',
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.updateUserInDB(req.params.userId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'User updated successfully!',
    data: result,
  });
});

const deactivateUser = catchAsync(async (req: Request, res: Response) => {
  await UserServices.deactivateUserInDB(req.params.userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'User deactivated successfully!',
    data: null,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.deleteUserFromDB(req.params.userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'User deleted successfully!',
    data: result,
  });
});

export const UserControllers = {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  deactivateUser,
  getMe,
};
