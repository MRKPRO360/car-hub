"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderValidationsSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const order_constant_1 = __importDefault(require("./order.constant"));
// Zod schema for validating ObjectId
const objectIdSchema = zod_1.z
    .string()
    .refine((value) => mongoose_1.default.Types.ObjectId.isValid(value), {
    message: 'Invalid ObjectId',
});
// Zod schema for validating IOrder
const createOrderValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        cars: zod_1.z.array(zod_1.z.object({
            car: objectIdSchema,
            quantity: zod_1.z.number().int().positive(),
        })),
    }),
});
const updateOrderValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum([...order_constant_1.default]).optional(),
    }),
});
exports.orderValidationsSchema = {
    createOrderValidationSchema,
    updateOrderValidationSchema,
};
