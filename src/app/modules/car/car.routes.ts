import express from 'express';
import { carControllers } from './car.controllers';
import validateRequest from '../../middlewares/validateRequest';
import { carValidationSchema } from './car.validation';

const router = express.Router();

// FOR ALL CAR
router
  .route('/')
  .get(carControllers.getAllCars)
  .post(
    validateRequest(carValidationSchema.createCarValidationSchema),
    carControllers.createACar
  );

// FOR SINGLE CAR
router
  .route('/:carId')
  .get(carControllers.getACar)
  .put(
    validateRequest(carValidationSchema.updateCarValidationSchema),
    carControllers.updateACar
  )
  .delete(carControllers.deleteACar);

export default router;
