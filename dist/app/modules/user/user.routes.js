"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_constant_1 = __importDefault(require("./user.constant"));
const user_controllers_1 = require("./user.controllers");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_validation_1 = require("./user.validation");
const router = express_1.default.Router();
router.route('/').get((0, auth_1.default)(user_constant_1.default.admin), user_controllers_1.UserControllers.getAllUsers);
router
    .route('/me')
    .get((0, auth_1.default)(user_constant_1.default.admin, user_constant_1.default.user), user_controllers_1.UserControllers.getMe);
router
    .route('/:userId')
    .get((0, auth_1.default)(user_constant_1.default.admin), user_controllers_1.UserControllers.getSingleUser)
    .patch((0, auth_1.default)(user_constant_1.default.admin, user_constant_1.default.user), (0, validateRequest_1.default)(user_validation_1.userValidationsSchema.updateUserValidationSchema), user_controllers_1.UserControllers.updateUser)
    .delete((0, auth_1.default)(user_constant_1.default.admin), user_controllers_1.UserControllers.deleteUser);
router
    .route('/deactivate-user/:userId')
    .patch((0, auth_1.default)(user_constant_1.default.admin), user_controllers_1.UserControllers.deactivateUser);
const userRoutes = router;
exports.default = userRoutes;
