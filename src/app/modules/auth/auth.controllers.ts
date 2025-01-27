import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import config from '../../config';
import { authServices } from './auth.services';

const registerUser = catchAsync(async (req, res) => {
  const result = await authServices.registerUserInDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: 'User registered successfully!',
    data: {
      _id: result?._id,
      name: result?.name,
      email: result?.email,
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

export const authControllers = {
  registerUser,
  loginUser,
  refreshToken,
};
