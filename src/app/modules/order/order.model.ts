import mongoose from 'mongoose';
import { IOrder } from './order.interface';
import orderStatus from './order.constant';

const orderSchema = new mongoose.Schema<IOrder>(
  {
    cars: [
      {
        car: {
          type: mongoose.Schema.Types.ObjectId,
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
      type: mongoose.Schema.Types.ObjectId,
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
      enum: orderStatus,
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
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

const Order = mongoose.model<IOrder>('Order', orderSchema);
export default Order;
