import mongoose from 'mongoose';
import { IMonthlyTarget } from './target.interface';

const monthlyTargetSchema = new mongoose.Schema<IMonthlyTarget>(
  {
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    targetAmount: { type: Number, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

const MonthlyTargetModel = mongoose.model('MonthlyTarget', monthlyTargetSchema);

export default MonthlyTargetModel;
