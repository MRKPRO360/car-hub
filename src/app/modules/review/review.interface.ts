/* eslint-disable no-unused-vars */
import { Document, Model, Types } from 'mongoose';

export interface IReview extends Document {
  user: Types.ObjectId;
  car: Types.ObjectId;
  rating: number;
  comment: string;
}

export interface ReviewModel extends Model<IReview> {
  calcAvgRatings: (carId: Types.ObjectId) => Promise<void>;
}
