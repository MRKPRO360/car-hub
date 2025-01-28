import express from 'express';
import USER_ROLES from './user.constant';
import { UserControllers } from './user.controllers';
import auth from '../../middlewares/auth';

const router = express.Router();

router.route('/').get(auth(USER_ROLES.admin), UserControllers.getAllUsers);

const userRoutes = router;

export default userRoutes;
