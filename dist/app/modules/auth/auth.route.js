"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_validation_1 = require("./auth.validation");
const auth_controllers_1 = require("./auth.controllers");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = __importDefault(require("../user/user.constant"));
const multer_config_1 = require("../../config/multer.config");
const router = express_1.default.Router();
router.route('/register').post(multer_config_1.multerUpload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(auth_validation_1.authValidations.registeredUserValidationSchema), auth_controllers_1.authControllers.registerUser);
router
    .route('/login')
    .post((0, validateRequest_1.default)(auth_validation_1.authValidations.loginValidationSchema), auth_controllers_1.authControllers.loginUser);
router.post('/refresh-token', (0, validateRequest_1.default)(auth_validation_1.authValidations.refreshTokenValidationSchema), auth_controllers_1.authControllers.refreshToken);
router.post('/change-password', (0, auth_1.default)(user_constant_1.default.user, user_constant_1.default.admin), (0, validateRequest_1.default)(auth_validation_1.authValidations.changePasswordValidationSchema), auth_controllers_1.authControllers.changePassword);
exports.default = router;
