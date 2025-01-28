import { Router } from 'express';

import carRoutes from '../app/modules/car/car.routes';
import orderRoutes from '../app/modules/order/order.routes';
import authRoutes from '../app/modules/auth/auth.route';
import userRoutes from '../app/modules/user/user.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/cars',
    route: carRoutes,
  },
  {
    path: '/orders',
    route: orderRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/users',
    route: userRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
