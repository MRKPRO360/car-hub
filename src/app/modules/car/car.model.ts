import mongoose from 'mongoose';
import { ICar } from './car.interface';

const carSchema = new mongoose.Schema<ICar>(
  {
    brand: {
      type: String,
      required: [true, 'A car must have a brand name!'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'A car must have a model name!'],
      trim: true,
    },
    year: {
      type: Number,
      default: new Date().getFullYear(),
    },
    price: {
      type: Number,
      required: [true, 'A car must have price!'],
    },

    img: {
      type: String,
    },
    category: {
      type: String,
      trim: true,
      enum: {
        values: ['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible'],
        message: '{VALUE} is not appropriate!',
      },
    },
    description: {
      type: String,
      required: [true, 'A car should have some description!'],
      trim: true,
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
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.isDeleted; // removes isDelete from json output :)
      },
    },
  }
);

// PRE SAVE MIDDLEWARE
carSchema.pre('save', function (next) {
  //NOTE: cheking if the quantity is less than 0 the inStcok field will be false otherwise true
  if (this.quantity <= 0) this.inStock = false;
  next();
});

// PRE FIND MIDDLEWARE
carSchema.pre('find', function (next) {
  //NOTE: filtering the documents that are not deleted
  this.find({ isDeleted: { $ne: true } });
  next();
});

const Car = mongoose.model<ICar>('Car', carSchema);

export default Car;
