import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { authValidations } from './auth.validation';
import { authControllers } from './auth.controllers';

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

export default router;
