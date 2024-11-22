import mongoose from 'mongoose';
import { IOrder } from './order.interface';

const orderSchema = new mongoose.Schema<IOrder>(
  {
    email: {
      type: String,
      required: [true, 'Email is required!'],
      validate: {
        validator: function (value: string) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        },
        message: 'Invalid email format!',
      },
    },
    car: {
      // type: mongoose.Schema.Types.ObjectId,
      type: String,
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
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

const Order = mongoose.model<IOrder>('Order', orderSchema);
export default Order;
