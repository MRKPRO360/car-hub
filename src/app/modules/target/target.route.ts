import express from 'express';
import { TargetControllers } from './target.controller';
import { MonthlyTargetValidationSchema } from './target.validations';
import validateRequest from '../../middlewares/validateRequest';

import USER_ROLES from '../user/user.constant';
import auth from '../../middlewares/auth';

const router = express.Router();

router
  .route('/')
  .post(
    auth(USER_ROLES.admin),
    validateRequest(
      MonthlyTargetValidationSchema.updateOrCreaeMonthlyTargetValidationSchema
    ),
    TargetControllers.createMonthlyTarget
  )
  .get(
    // auth(USER_ROLES.admin),
    validateRequest(
      MonthlyTargetValidationSchema.getMonthlyTargetValidationSchema
    ),
    TargetControllers.getMonthlyTargetByYearAndMonth
  )
  .patch(
    auth(USER_ROLES.admin),
    validateRequest(
      MonthlyTargetValidationSchema.updateOrCreaeMonthlyTargetValidationSchema
    ),
    TargetControllers.updateMonthlyTarget
  );

export default router;
