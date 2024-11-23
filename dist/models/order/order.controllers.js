"use strict";
//NOTE: BETTER ERROR HANDLING
//  if (error instanceof z.ZodError) {
//    console.error('Validation failed:', error.errors);
//  } else {
//    console.error('Error creating order:', error);
//  }
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderControllers = void 0;
const order_services_1 = require("./order.services");
// import { orderZodSchema } from './order.validation';
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // FIXME:
        // const validatedData = orderZodSchema.parse(req.body);
        const result = yield order_services_1.orderServices.createOrderInDB(req.body);
        res.status(201).json({
            message: 'Order created successfully!',
            success: true,
            data: result,
        });
    }
    catch (err) {
        res.status(400).json({
            message: err.message || 'Validation failed!',
            success: false,
            error: err,
            stack: err.stack,
        });
    }
});
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield order_services_1.orderServices.getAllOrdersFromDB();
        res.status(200).json({
            message: 'Order retrieved successfully!',
            success: true,
            data: result,
        });
    }
    catch (err) {
        res.status(400).json({
            message: 'Something went wrong!',
            success: false,
            error: err,
            stack: err.stack,
        });
    }
});
const getAllOrdersWithCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield order_services_1.orderServices.getOrderWithCarFromDB();
        res.status(200).json({
            message: 'Order retrieved successfully!',
            success: true,
            data: result,
        });
    }
    catch (err) {
        res.status(400).json({
            message: 'Something went wrong!',
            success: false,
            error: err,
            stack: err.stack,
        });
    }
});
const claculateRevenue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield order_services_1.orderServices.claculateRevenueFromDB();
        res.status(200).json({
            message: 'Revenue calculated successfully!',
            status: true,
            success: true,
            data: result,
        });
    }
    catch (err) {
        res.status(400).json({
            message: 'Something went wrong!',
            success: false,
            error: err,
            stack: err.stack,
        });
    }
});
exports.orderControllers = {
    getAllOrders,
    createOrder,
    claculateRevenue,
    getAllOrdersWithCar,
};
