import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewValidation } from './review.validation';
import { ReviewControllers } from './review.controller';
import USER_ROLES from '../user/user.constant';

const router = express.Router();

// router
//   .route('/elegibility')
//   .post(auth(USER_ROLES.user), ReviewControllers.checkReviewEleigibility);

router
  .route('/')
  .post(
    auth(USER_ROLES.user),
    validateRequest(ReviewValidation.createReviewValidationSchema),
    ReviewControllers.createReview
  );

router
  .route('/:id')
  .patch(
    auth(USER_ROLES.admin, USER_ROLES.user),
    validateRequest(ReviewValidation.updateReviewValidationSchema),
    ReviewControllers.updateReview
  )
  .delete(auth(USER_ROLES.user), ReviewControllers.deleteSingleReview);

router.get('/car', ReviewControllers.getAllCarReviews);

export default router;
