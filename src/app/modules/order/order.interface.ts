import mongoose, { Document } from 'mongoose';
export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  cars: {
    car: mongoose.Types.ObjectId;
    quantity: number;
  }[];
  totalPrice: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'PAID' | 'SHIPPED';
  transaction: {
    id: string;
    transactionStatus: string;
    bank_status: string;
    sp_code: string;
    sp_message: string;
    method: string;
    date_time: string;
  };
}
