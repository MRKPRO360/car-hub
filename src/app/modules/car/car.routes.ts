import express, { NextFunction, Request, Response } from 'express';
import { carControllers } from './car.controllers';
import validateRequest from '../../middlewares/validateRequest';
import { carValidationSchema } from './car.validation';
import auth from '../../middlewares/auth';
import USER_ROLES from '../user/user.constant';
import { multerUpload } from '../../config/multer.config';

const router = express.Router();

// FOR ALL CAR
router
  .route('/')
  .get(carControllers.getAllCars)
  .post(
    auth(USER_ROLES.admin),
    multerUpload.fields([
      { name: 'coverImage', maxCount: 1 },
      { name: 'images', maxCount: 3 },
    ]),

    (req: Request, res: Response, next: NextFunction) => {
      if (req.body.data) {
        req.body = JSON.parse(req.body.data);
      }
      if (req.files && (req.files as any).coverImage) {
        req.body.coverImage = (req.files as any).coverImage[0].path;
      }

      // PROJECT IMAGES
      if (req.files && (req.files as any).images) {
        req.body.images = (req.files as any).images.map(
          (file: any) => file.path
        );
      }
      next();
    },
    validateRequest(carValidationSchema.createCarValidationSchema),
    carControllers.createACar
  );

router
  .route('/my-car')
  .get(auth(USER_ROLES.admin, USER_ROLES.user), carControllers.getMyCars);

// FOR SINGLE CAR
router
  .route('/:carId')
  .get(carControllers.getACar)
  .patch(
    auth(USER_ROLES.admin),
    multerUpload.fields([
      { name: 'coverImage', maxCount: 1 },
      { name: 'images', maxCount: 3 },
    ]),

    (req: Request, res: Response, next: NextFunction) => {
      if (req.body.data) {
        req.body = JSON.parse(req.body.data);
      }
      if (req.files && (req.files as any).coverImage) {
        req.body.coverImage = (req.files as any).coverImage[0].path;
      }

      // PROJECT IMAGES
      if (req.files && (req.files as any).images) {
        req.body.images = (req.files as any).images.map(
          (file: any) => file.path
        );
      }
      next();
    },
    validateRequest(carValidationSchema.updateCarValidationSchema),
    carControllers.updateACar
  )
  .delete(carControllers.deleteACar);

export default router;
