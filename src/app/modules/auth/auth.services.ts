import config from '../../config';
import AppError from '../../errors/AppError';
import { IUser } from '../user/user.interface';
import User from '../user/user.model';
import { ILogin } from './auth.interface';
import createToken from './auth.utils';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const registerUserInDB = async (file: any, payload: IUser) => {
  // CHECK IF USER EXISTS
  const userExists = await User.isUserExistsByEmail(payload.email);

  if (userExists) throw new AppError(400, 'User already registered!');

  return await User.create({ profileImg: file?.path || '', ...payload });
};

const loginUserFromDB = async (payload: ILogin) => {
  // CHECK IF USER EXISTS
  const user = await User.isUserExistsByEmail(payload.email);

  if (!user) throw new AppError(404, 'User not found!');

  // CHECK IF USER IS BLOCKED
  if (user.isBlocked) throw new AppError(403, 'User is blocked!');

  // CHECK IF PASSWORD IS CORRECT
  const isPasswordCorrect = await User.isPasswordMatched(
    payload.password,
    user.password
  );

  if (!isPasswordCorrect) throw new AppError(401, 'Incorrect password!');

  // CHECK IF USER IS DELETED
  if (user.isDeleted) throw new AppError(403, 'User is deleted!');

  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshTokenFromDB = async (token: string) => {
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string
  ) as JwtPayload;

  const { email } = decoded;

  const user = await User.isUserExistsByEmail(email);

  if (!user) throw new AppError(404, 'This user is not found!');

  if (user && user.isBlocked === true)
    throw new AppError(403, 'Unauthorized user!');

  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  return { accessToken };
};

const changePasswordInDB = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  const { email } = userData;

  // CHECK IF USER EXISTS
  const user = await User.isUserExistsByEmail(email);

  if (!user) throw new AppError(404, 'User not found!');

  // CHECK IF USER IS BLOCKED
  if (user.isBlocked) throw new AppError(403, 'User is blocked!');

  // CHECK IF PASSWORD IS CORRECT
  const isPasswordCorrect = await User.isPasswordMatched(
    payload.oldPassword,
    user.password
  );

  if (!isPasswordCorrect) throw new AppError(400, 'Incorrect password!');

  // CHECK IF USER IS DELETED
  if (user.isDeleted) throw new AppError(403, 'User is deleted!');

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  const result = await User.findOneAndUpdate(
    {
      email: userData.email,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    }
  );

  return result;
};

export const authServices = {
  registerUserInDB,
  loginUserFromDB,
  refreshTokenFromDB,
  changePasswordInDB,
};
