import { Router } from "express";

import carRoutes from "../app/modules/car/car.routes";
import orderRoutes from "../app/modules/order/order.routes";

const router = Router();

const moduleRoutes = [
  {
    path: "/cars",
    route: carRoutes,
  },
  {
    path: "/orders",
    route: orderRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
