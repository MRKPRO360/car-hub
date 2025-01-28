import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { authValidations } from './auth.validation';
import { authControllers } from './auth.controllers';
import auth from '../../middlewares/auth';
import USER_ROLES from '../user/user.constant';

const router = express.Router();

router
  .route('/register')
  .post(
    validateRequest(authValidations.registeredUserValidationSchema),
    authControllers.registerUser
  );

router
  .route('/login')
  .post(
    validateRequest(authValidations.loginValidationSchema),
    authControllers.loginUser
  );

router.post(
  '/refresh-token',
  validateRequest(authValidations.refreshTokenValidationSchema),
  authControllers.refreshToken
);

router.post(
  '/change-password',
  auth(USER_ROLES.user, USER_ROLES.admin),
  validateRequest(authValidations.changePasswordValidationSchema),
  authControllers.changePassword
);

export default router;
