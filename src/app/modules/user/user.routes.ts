import express from 'express';
import USER_ROLES from './user.constant';
import { UserControllers } from './user.controllers';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { userValidationsSchema } from './user.validation';

const router = express.Router();

router.route('/').get(auth(USER_ROLES.admin), UserControllers.getAllUsers);
router
  .route('/:userId')
  .get(auth(USER_ROLES.admin), UserControllers.getSingleUser)
  .patch(
    auth(USER_ROLES.admin, USER_ROLES.user),
    validateRequest(userValidationsSchema.updateUserValidationSchema),
    UserControllers.updateUser
  )
  .delete(auth(USER_ROLES.admin), UserControllers.deleteUser);

const userRoutes = router;

export default userRoutes;
