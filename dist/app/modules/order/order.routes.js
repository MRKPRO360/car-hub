"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controllers_1 = require("./order.controllers");
const router = express_1.default.Router();
router
    .route('/')
    .get(order_controllers_1.orderControllers.getAllOrders)
    .post(order_controllers_1.orderControllers.createOrder);
router.route('/revenue').get(order_controllers_1.orderControllers.claculateRevenue);
router.route('/orderWithCar').get(order_controllers_1.orderControllers.getAllOrdersWithCar);
exports.default = router;
