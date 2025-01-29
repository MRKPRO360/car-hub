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

router.get(
  '/verify-order',
  auth(USER_ROLES.user, USER_ROLES.admin),
  orderControllers.verifyPayment
);

router
  .route('/:orderId')
  .patch(
    auth(USER_ROLES.user, USER_ROLES.admin),
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

export default router;
