import express from 'express';
import { orderControllers } from './order.controllers';

const router = express.Router();

router
  .route('/')
  .get(orderControllers.getAllOrders)
  .post(orderControllers.createOrder);

router.route('/revenue').get(orderControllers.claculateRevenue);

router.route('/orderWithCar').get(orderControllers.getAllOrdersWithCar);

export default router;
