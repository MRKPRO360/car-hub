import { Request, Response } from 'express';
import { ReviewServices } from './review.service';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';

// const checkReviewEleigibility = catchAsync(
//   async (req: Request, res: Response) => {
//     const { id } = req.user!;

//     const result = await ReviewServices.checkReviewEleigibilityFromDB({
//       userId: id,
//       ...req.body,
//     });

//     sendResponse(res, {
//       statusCode: 200,
//       success: true,
//       message: 'Elegibility checked!',
//       data: result,
//     });
//   }
// );

const createReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user!;

  const result = await ReviewServices.createReviewInDB({
    userId: id,
    ...req.body,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Review submitted successfully',
    data: result,
  });
});

const getAllCarReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewServices.getAllCarReviewsForFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All recipes review retrieved successfully',
    data: result,
  });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await ReviewServices.updateReviewInDB(req.body, id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Review updated successfully!',
    data: result,
  });
});

const deleteSingleReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await ReviewServices.deleteReviewFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Review deleted successfully!',
    data: result,
  });
});

export const ReviewControllers = {
  // checkReviewEleigibility,
  createReview,
  getAllCarReviews,
  updateReview,
  deleteSingleReview,
};
