import { Types } from 'mongoose';

export interface ICar {
  _id: Types.ObjectId;
  brand: string;
  model: string;
  year: number;
  price: number;
  category: 'Sedan' | 'SUV' | 'Truck' | 'Coupe' | 'Convertible';
  description: string;
  quantity: number;
  inStock: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
  img?: string;
  author: Types.ObjectId;
}
