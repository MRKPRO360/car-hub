import express from 'express';
import { carControllers } from './car.controllers';

const router = express.Router();

// FOR ALL CAR
router
  .route('/')
  .get(carControllers.getAllCars)
  .post(carControllers.createACar);

// FOR SINGLE CAR
router
  .route('/:carId')
  .get(carControllers.getACar)
  .put(carControllers.updateACar)
  .delete(carControllers.deleteACar);

export default router;
