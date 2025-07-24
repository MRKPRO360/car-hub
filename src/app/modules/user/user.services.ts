import User from './user.model';
import AppError from '../../errors/AppError';
import { IUser } from './user.interface';
import { JwtPayload } from 'jsonwebtoken';

const getAllUsersFromDB = async () => {
  return await User.find({ role: { $ne: 'admin' } });
};
const getSingleUserFromDB = async (id: string) => {
  return await User.findById(id);
};

const getMeFromDB = async (payload: JwtPayload) => {
  return await User.findOne({ email: payload.email });
};

const updateUserInDB = async (id: string, payload: Partial<IUser>) => {
  const user = await User.findById(id);

  if (!user) throw new AppError(400, 'User not found!');

  return await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

const deactivateUserInDB = async (id: string) => {
  const user = await User.findById(id);

  if (!user) throw new AppError(400, 'User not found!');
  if (user.isBlocked) throw new AppError(400, 'User is already blocked');

  return await User.findByIdAndUpdate(
    id,
    { isBlocked: true },
    {
      new: true,
      runValidators: true,
    }
  );
};

const activateUserInDB = async (id: string) => {
  const user = await User.findById(id);

  if (!user) throw new AppError(400, 'User not found!');
  if (!user.isBlocked) throw new AppError(400, 'User is not blocked');

  return await User.findByIdAndUpdate(
    id,
    { isBlocked: false },
    {
      new: true,
      runValidators: true,
    }
  );
};

const deleteUserFromDB = async (id: string) => {
  const user = await User.findById(id);

  if (!user) throw new AppError(400, 'User not found!');

  return await User.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

export const UserServices = {
  getAllUsersFromDB,
  updateUserInDB,
  deleteUserFromDB,
  deactivateUserInDB,
  activateUserInDB,
  getSingleUserFromDB,
  getMeFromDB,
};
