import User from './user.model';
import AppError from '../../errors/AppError';
import { IUser } from './user.interface';

const getAllUsersFromDB = async () => {
  return await User.find();
};

const getSingleUserFromDB = async (id: string) => {
  return await User.findById(id);
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
  console.log(user);

  return await User.findByIdAndUpdate(
    id,
    { isBlocked: true },
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
  getSingleUserFromDB,
};
