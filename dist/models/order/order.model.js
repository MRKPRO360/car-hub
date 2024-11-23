"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const orderSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: [true, 'Email is required!'],
        validate: {
            validator: function (value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value);
            },
            message: 'Invalid email format!',
        },
    },
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
    totalPrice: {
        type: Number,
        required: [true, 'Total price is required!'],
        min: [0, 'Total price cannot be negative!'],
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
});
const Order = mongoose_1.default.model('Order', orderSchema);
exports.default = Order;
