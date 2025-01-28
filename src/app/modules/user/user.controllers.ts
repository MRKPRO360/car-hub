import { Request, Response } from 'express';
import catchAsync from '../../../utils/catchAsync';
import { UserServices } from './user.services';
import sendResponse from '../../../utils/sendResponse';
import { JwtPayload } from 'jsonwebtoken';

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getAllUsersFromDB(req.user as JwtPayload);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Users retrieved successfully!',
    data: result,
  });
});

export const UserControllers = {
  getAllUsers,
};
