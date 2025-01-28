"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const car_routes_1 = __importDefault(require("../app/modules/car/car.routes"));
const order_routes_1 = __importDefault(require("../app/modules/order/order.routes"));
const auth_route_1 = __importDefault(require("../app/modules/auth/auth.route"));
const user_routes_1 = __importDefault(require("../app/modules/user/user.routes"));
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/cars',
        route: car_routes_1.default,
    },
    {
        path: '/orders',
        route: order_routes_1.default,
    },
    {
        path: '/auth',
        route: auth_route_1.default,
    },
    {
        path: '/users',
        route: user_routes_1.default,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
