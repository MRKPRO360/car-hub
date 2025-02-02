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
    auth(USER_ROLES.admin, USER_ROLES.user),
    multerUpload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
      req.body = JSON.parse(req.body.data);
      next();
    },
    validateRequest(carValidationSchema.createCarValidationSchema),
    carControllers.createACar
  );

// FOR SINGLE CAR
router
  .route('/:carId')
  .get(carControllers.getACar)
  .patch(
    validateRequest(carValidationSchema.updateCarValidationSchema),
    carControllers.updateACar
  )
  .delete(carControllers.deleteACar);

export default router;

// router.post(
//   '/create-faculty',
//   auth(USER_ROLE.superAdmin, USER_ROLE.admin),
//   upload.single('file'),
//   (req: Request, res: Response, next: NextFunction) => {
//     req.body = JSON.parse(req.body.data);
//     next();
//   },
//   validateRequest(createFacultyValidationSchema),
//   UserControllers.createFaculty
// );
