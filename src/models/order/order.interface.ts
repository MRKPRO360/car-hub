// import { Types } from 'mongoose';
//FIXME: NOT WORKING WHEN GIVING car TYPE OBJECTID
export interface IOrder {
  email: string;
  // FOR ADDING MONGOOSE ID TYPE
  // car: Types.ObjectId;
  car: string;
  quantity: number;
  totalPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}
