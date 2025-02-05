"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controllers_1 = require("./order.controllers");
const user_constant_1 = __importDefault(require("../user/user.constant"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const order_validation_1 = require("./order.validation");
const router = express_1.default.Router();
router
    .route('/')
    .get((0, auth_1.default)(user_constant_1.default.user, user_constant_1.default.admin), order_controllers_1.orderControllers.getAllOrders)
    .post((0, auth_1.default)(user_constant_1.default.user, user_constant_1.default.admin), (0, validateRequest_1.default)(order_validation_1.orderValidationsSchema.createOrderValidationSchema), order_controllers_1.orderControllers.createOrder);
router
    .route('/verify-order')
    .get((0, auth_1.default)(user_constant_1.default.user, user_constant_1.default.admin), order_controllers_1.orderControllers.verifyPayment);
router
    .route('/my-orders')
    .get((0, auth_1.default)(user_constant_1.default.user), order_controllers_1.orderControllers.getMyOrders);
router
    .route('/:orderId')
    .patch((0, validateRequest_1.default)(order_validation_1.orderValidationsSchema.updateOrderValidationSchema), (0, auth_1.default)(user_constant_1.default.admin), order_controllers_1.orderControllers.updateAnOrder)
    .delete((0, auth_1.default)(user_constant_1.default.user, user_constant_1.default.admin), order_controllers_1.orderControllers.deleteAnOrder);
router
    .route('/revenue')
    .get((0, auth_1.default)(user_constant_1.default.user, user_constant_1.default.admin), order_controllers_1.orderControllers.claculateRevenue);
exports.default = router;
