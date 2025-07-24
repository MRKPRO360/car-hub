import { Types } from 'mongoose';

interface ICarDetails {
  mileage: number; // in kilometers or miles
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | 'CNG' | 'LPG';
  transmission: 'Automatic' | 'Manual';
  color?: string;
  engine?: string; // e.g., "2.0L V4", "Dual Motor", etc.
  horsepower?: number;
  torque?: number; // in Nm or lb-ft
  seatingCapacity?: number;
  features?: string[]; // e.g., ['Bluetooth', 'Sunroof']
  vin?: string;
  condition?: 'New' | 'Used' | 'Certified Pre-Owned';
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  views?: number;
}

export interface ICar extends ICarDetails {
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
  coverImage: string;
  images: string[];
  author: Types.ObjectId;
  ratingAverage: number;
  ratingQuantity: number;
}
