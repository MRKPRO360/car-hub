import User from './user.model';
import AppError from '../../errors/AppError';
import { IUser } from './user.interface';
import { JwtPayload } from 'jsonwebtoken';
import createToken from '../auth/auth.utils';
import config from '../../config';

const getAllUsersFromDB = async () => {
  return await User.find({ role: { $ne: 'admin' } });
};

const getAllUsersByCountryFromDB = async () => {
  return await User.aggregate([
    {
      $match: {
        role: { $ne: 'admin' },
        country: { $exists: true, $ne: { $or: [null, ''] } },
      },
    },
    {
      $group: {
        _id: '$country',
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $project: {
        country: '$_id',
        customerCount: '$count',
        _id: 0,
      },
    },
  ]);
};
const getSingleUserFromDB = async (id: string) => {
  return await User.findById(id);
};

const getMeFromDB = async (payload: JwtPayload) => {
  return await User.findOne({ email: payload.email });
};

const updateUserInDB = async (
  id: string,
  file: any,
  payload: Partial<IUser>
) => {
  const user = await User.findById(id);

  // DETERMINING IF TOKEN SENSITIVE FIELDS ARE CHANGED
  const tokenSesnitiveFields = ['email', 'role', 'profileImg'];

  const shouldUpdateToken = tokenSesnitiveFields.some(
    (field) =>
      payload[field as keyof IUser] !== undefined &&
      payload[field as keyof IUser] !== user?.[field as keyof IUser]
  );

  const updateUser = await User.findByIdAndUpdate(
    id,
    { profileImg: file?.path || user?.profileImg, ...payload },
    {
      new: true,
      runValidators: true,
    }
  );

  let accessToken, refreshToken;

  if ((file && updateUser) || (shouldUpdateToken && updateUser)) {
    const jwtPayload = {
      email: updateUser.email,
      role: updateUser.role,
      profileImg: updateUser.profileImg,
      userID: updateUser._id,
    };

    accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string
    );

    refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.jwt_refresh_expires_in as string
    );

    return {
      updateUser,
      ...(accessToken && refreshToken ? { accessToken, refreshToken } : {}),
    };
  } else {
    return {
      updateUser,
      accessToken,
      refreshToken,
    };
  }
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
  getAllUsersByCountryFromDB,
  updateUserInDB,
  deleteUserFromDB,
  deactivateUserInDB,
  activateUserInDB,
  getSingleUserFromDB,
  getMeFromDB,
};
