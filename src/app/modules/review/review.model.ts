// review.model.ts
import { Schema, Types, model } from 'mongoose';
import { IReview, ReviewModel } from './review.interface';
import Car from '../car/car.model';

const reviewSchema = new Schema<IReview, ReviewModel>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    car: { type: Schema.Types.ObjectId, ref: 'Car', required: true },

    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
  },
  { timestamps: true }
);

reviewSchema.statics.calcAvgRatings = async function (carId: Types.ObjectId) {
  const stats = await this.aggregate([
    { $match: { car: carId } },
    {
      $group: {
        _id: '$car',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  const rating = stats[0]?.avgRating?.toFixed(1) || '3.0';
  const count = stats[0]?.nRating || 0;

  await Car.findByIdAndUpdate(carId, {
    rating: rating,
    ratingsCount: count,
  });
};

// After creating a review
reviewSchema.post('save', async function () {
  await (this.constructor as ReviewModel).calcAvgRatings(this.car);
});

// After updating or deleting a review
reviewSchema.post('findOneAndUpdate', async function (doc, next) {
  if (!doc) return next();
  await Review.calcAvgRatings(doc.car);
  next();
});

reviewSchema.post('findOneAndDelete', async function (doc, next) {
  if (!doc) return next();
  await Review.calcAvgRatings(doc.car);
  next();
});

// ONE REVIEW PER PERSON PER ITEM
reviewSchema.index({ user: 1, car: 1 }, { unique: true });

const Review = model<IReview, ReviewModel>('Review', reviewSchema);
export default Review;
