import mongoose, { Document } from 'mongoose';
export interface IOrder extends Document {
  email: string;
  // FOR ADDING MONGOOSE ID TYPE
  car: mongoose.Types.ObjectId;
  quantity: number;
  totalPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}
