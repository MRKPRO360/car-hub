import express from 'express';
import { orderControllers } from './order.controllers';

const router = express.Router();

router
  .route('/')
  .get(orderControllers.getAllOrders)
  .post(orderControllers.createOrder);

export default router;
