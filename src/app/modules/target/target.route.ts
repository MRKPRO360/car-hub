import express from 'express';
import { TargetControllers } from './target.controller';
import { MonthlyTargetValidationSchema } from './target.validations';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router
  .route('/')
  .post(
    validateRequest(
      MonthlyTargetValidationSchema.updateOrCreaeMonthlyTargetValidationSchema
    ),
    TargetControllers.createMonthlyTarget
  )
  .get(
    validateRequest(
      MonthlyTargetValidationSchema.getMonthlyTargetValidationSchema
    ),
    TargetControllers.getMonthlyTarget
  )
  .patch(
    validateRequest(
      MonthlyTargetValidationSchema.updateOrCreaeMonthlyTargetValidationSchema
    ),
    TargetControllers.updateMonthlyTarget
  );

export default router;
