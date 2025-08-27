import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import config from '../../config';
import { authServices } from './auth.services';
import { IUser } from '../user/user.interface';

const registerUser = catchAsync(async (req, res) => {
  const result = await authServices.registerUserInDB(req.file, req.body);

  const { refreshToken, accessToken } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
    sameSite: true,
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: 'User registered successfully!',
    data: {
      token: accessToken,
    },
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await authServices.loginUserFromDB(req.body);

  const { refreshToken, accessToken } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
    sameSite: true,
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: 'User logged in successfully!',
    data: {
      token: accessToken,
    },
  });
});

const googleLogin = catchAsync(async (req, res) => {
  // req.body = token(From frontend)
  const { token } = req.body;
  const result = await authServices.googleLoginFromDB(token);

  const { refreshToken, accessToken } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
    sameSite: true,
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: 'User logged in successfully!',
    data: {
      token: accessToken,
    },
  });
});

const facebookLogin = catchAsync(async (req, res) => {
  const user = req.user as IUser;

  const result = await authServices.facebookLoginFromDB(user);

  const { refreshToken, accessToken } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
    sameSite: true,
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  // Redirect to frontend with access token
  const frontendURL = `https://car-frontend-azure.vercel.app/fblogin-success?token=${accessToken}`;

  res.redirect(frontendURL);
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  const result = await authServices.refreshTokenFromDB(refreshToken);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: 'User logged in successfully!',
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;

  const result = await authServices.changePasswordInDB(
    req.user as JwtPayload,
    passwordData
  );

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: 'User logged in successfully!',
    data: result,
  });
});

export const authControllers = {
  registerUser,
  loginUser,
  googleLogin,
  facebookLogin,
  refreshToken,
  changePassword,
};
