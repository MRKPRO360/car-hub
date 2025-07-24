import { IReview } from './review.interface';
import Review from './review.model';
// import User from '../user/user.model';

// const checkReviewEleigibilityFromDB = async (payload: {
//   targetId: Types.ObjectId;
//   targetType: 'recipe' | 'provider';
//   userId: Types.ObjectId;
// }) => {
//   const customer = await Customer.findOne({ user: payload.userId });

//   if (!customer)
//     throw new AppError(403, 'Only customers can leave a recipe review!');

//   let eligible = false;
//   let alreadyReviewed = false;

//   // CHECK IF ALREADY REVIEWED
//   const existing = await Review.findOne({
//     userId: payload.userId,
//     targetId: payload.targetId,
//     targetType: payload.targetType,
//   });

//   alreadyReviewed = !!existing;

//   // PURCHASE CHECK
//   if (payload.targetType === 'recipe') {
//     eligible = await hasCustomerPurchasedRecipe(
//       payload.userId,
//       payload.targetId,
//     );
//   } else if (payload.targetType === 'provider') {
//     const orders = await Order.find({
//       user: payload.userId,
//       'meals.status': 'Completed',
//     });

//     const completedMealIds = orders.flatMap((order) =>
//       order.meals
//         .filter((meal) => meal.status === 'Completed')
//         .map((meal) => meal.meal.toString()),
//     );

//     const mealFromProvider = await Recipe.findOne({
//       _id: { $in: completedMealIds },
//       providerId: payload.targetId,
//     });

//     if (!mealFromProvider)
//       throw new AppError(
//         403,
//         'You can only review a provider you have ordered from.',
//       );
//     else {
//       eligible = true;
//     }
//   }

//   return {
//     eligibleToReview: eligible,
//     alreadyReviewed,
//   };
// };

// const checkReviewEleigibilityFromDB = async (payload: {
//   targetId: Types.ObjectId;
//   targetType: 'recipe' | 'provider';
//   userId: Types.ObjectId;
// }) => {
//   const customer = await Customer.findOne({ user: payload.userId });

//   if (!customer)
//     throw new AppError(403, 'Only customers can leave a recipe review!');

//   let eligible = false;
//   let alreadyReviewed = false;

//   // Check if already reviewed
//   const existing = await Review.findOne({
//     userId: payload.userId,
//     targetId: payload.targetId,
//     targetType: payload.targetType,
//   });

//   alreadyReviewed = !!existing;

//   if (payload.targetType === 'recipe') {
//     await validateRecipeReviewEligibility(payload.userId, payload.targetId);
//     eligible = true;
//   } else if (payload.targetType === 'provider') {
//     const orders = await Order.find({
//       user: payload.userId,
//       'meals.status': 'Completed',
//     });

//     const completedMealIds = orders.flatMap((order) =>
//       order.meals
//         .filter((meal) => meal.status === 'Completed')
//         .map((meal) => meal.meal.toString()),
//     );

//     const mealFromProvider = await Recipe.findOne({
//       _id: { $in: completedMealIds },
//       providerId: payload.targetId,
//     });

//     if (!mealFromProvider) {
//       throw new AppError(
//         403,
//         'You can only review a provider you have ordered from.',
//       );
//     } else {
//       eligible = true;
//     }
//   }

//   return {
//     eligibleToReview: eligible,
//     alreadyReviewed,
//   };
// };

const getAllCarReviewsForFromDB = async () => {
  return await Review.find()
    // .populate({
    //   path: 'userId',
    //   select: 'name email',
    //   populate: {
    //     path: 'user',
    //     select: 'profileImg',
    //   },
    // })
    .lean();
};

const createReviewInDB = async (payload: IReview) => {
  // const user = await User.findOne({ user: payload.user });

  // if (!user)
  //   throw new AppError(403, 'Only customers can leave a recipe review!');

  return await Review.create(payload);
};

const updateReviewInDB = async (
  payload: Partial<IReview>,
  reviewId: string
) => {
  return await Review.findByIdAndUpdate(reviewId, payload, {
    new: true,
  });
};

const deleteReviewFromDB = async (reviewId: string) => {
  return await Review.findByIdAndDelete(reviewId);
};

export const ReviewServices = {
  // checkReviewEleigibilityFromDB,
  createReviewInDB,
  getAllCarReviewsForFromDB,
  updateReviewInDB,
  deleteReviewFromDB,
};
