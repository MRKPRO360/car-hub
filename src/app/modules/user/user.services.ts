import { JwtPayload } from 'jsonwebtoken';
import User from './user.model';
import AppError from '../../errors/AppError';

const getAllUsersFromDB = async (userData: JwtPayload) => {
  //CHECK IF THE ADMIN IS EXISTS
  const admin = await User.isUserExistsByEmail(userData.email);

  if (!admin)
    throw new AppError(403, 'You are not authorized to perform this action');

  return await User.find();
};

export const UserServices = {
  getAllUsersFromDB,
};
