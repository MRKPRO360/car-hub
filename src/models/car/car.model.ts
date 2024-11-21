import mongoose from 'mongoose';
import { ICar } from './car.interface';

const carSchema = new mongoose.Schema<ICar>(
  {
    brand: {
      type: String,
      required: [true, 'A car must have a name!'],
    },
    model: {
      type: String,
      required: [true, 'A car must have a model name!'],
    },
    year: {
      type: Number,
      required: [true, 'A car must have released year!'],
    },
    price: {
      type: Number,
      required: [true, 'A car must have price!'],
    },
    category: {
      type: String,
      enum: {
        values: ['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible'],
        message: '{VALUE} is not appropriate!',
      },
    },
    description: {
      type: String,
      required: [true, 'A car should have some description!'],
    },
    quantity: {
      type: Number,
      required: [
        true,
        'quantity is required. Specify the quantity of the product.',
      ],
      validate: {
        validator: function (value: number) {
          const isPositive = value >= 0;
          return isPositive;
        },
      },
    },
    inStock: {
      type: Boolean,
      required: [
        true,
        'inStock is required. Specify whether the product is in storck.',
      ],
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Car = mongoose.model<ICar>('Car', carSchema);

export default Car;
