import { Request, Response } from 'express';
import catchAsync from '../../../utils/catchAsync';
import { UserServices } from './user.services';
import sendResponse from '../../../utils/sendResponse';
import config from '../../config';

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getAllUsersFromDB();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Users retrieved successfully!',
    data: result,
  });
});

const getAllUsersByCountry = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getAllUsersByCountryFromDB();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Users with country name retrieved successfully!',
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
  const result = await UserServices.updateUserInDB(
    req.params.userId,
    req.file,
    req.body
  );
  // TYPE ERROR (FIX LATER)
  const { updateUser, accessToken, refreshToken } = result;

  if (refreshToken) {
    res.cookie('refreshToken', refreshToken, {
      secure: config.node_env === 'production',
      httpOnly: true,
      sameSite: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });
  }

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'User updated successfully!',
    data: {
      user: updateUser,
      ...(accessToken ? { token: accessToken } : {}),
    },
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

const activateUser = catchAsync(async (req: Request, res: Response) => {
  await UserServices.activateUserInDB(req.params.userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'User activated successfully!',
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
  getAllUsersByCountry,
  getSingleUser,
  updateUser,
  deleteUser,
  deactivateUser,
  activateUser,
  getMe,
};
