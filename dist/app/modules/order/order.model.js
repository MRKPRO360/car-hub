"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const order_constant_1 = __importDefault(require("./order.constant"));
const orderSchema = new mongoose_1.default.Schema({
    cars: [
        {
            car: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'Car', // Referrencing Car model
                required: [true, 'Car object id is required!'],
            },
            quantity: {
                type: Number,
                required: [true, 'Quantity is required!'],
                min: [1, 'Quantity must be at least 1!'],
            },
        },
    ],
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User', // Referrencing User model
        required: [true, 'User object id is required!'],
    },
    totalPrice: {
        type: Number,
        required: [true, 'Total price is required!'],
        min: [0, 'Total price cannot be negative!'],
    },
    status: {
        type: String,
        enum: order_constant_1.default,
        default: 'PENDING',
    },
    transaction: {
        id: String,
        transactionStatus: String,
        bank_status: String,
        sp_code: String,
        sp_message: String,
        method: String,
        date_time: String,
    },
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
});
const Order = mongoose_1.default.model('Order', orderSchema);
exports.default = Order;
