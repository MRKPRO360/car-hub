import express from 'express';
import { orderControllers } from './order.controllers';
import USER_ROLES from '../user/user.constant';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { orderValidationsSchema } from './order.validation';

const router = express.Router();

router
  .route('/')
  .get(auth(USER_ROLES.user, USER_ROLES.admin), orderControllers.getAllOrders)
  .post(
    auth(USER_ROLES.user, USER_ROLES.admin),
    validateRequest(orderValidationsSchema.createOrderValidationSchema),
    orderControllers.createOrder
  );

router
  .route('/verify-order')
  .get(auth(USER_ROLES.user, USER_ROLES.admin), orderControllers.verifyPayment);

router
  .route('/my-orders')
  .get(auth(USER_ROLES.user, USER_ROLES.admin), orderControllers.getMyOrders);

router
  .route('/:orderId')
  .patch(
    validateRequest(orderValidationsSchema.updateOrderValidationSchema),
    auth(USER_ROLES.admin),
    orderControllers.updateAnOrder
  )
  .delete(
    auth(USER_ROLES.user, USER_ROLES.admin),
    orderControllers.deleteAnOrder
  );

router
  .route('/revenue')
  .get(
    auth(USER_ROLES.user, USER_ROLES.admin),
    orderControllers.claculateRevenue
  );

router
  .route('/monthly-sales')
  .get(auth(USER_ROLES.admin), orderControllers.getMonthlySales);

router
  .route('/customers')
  .get(auth(USER_ROLES.admin), orderControllers.getAllCustomerAndOrders);

export default router;
