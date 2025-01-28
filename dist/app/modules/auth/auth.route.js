"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_validation_1 = require("./auth.validation");
const auth_controllers_1 = require("./auth.controllers");
const router = express_1.default.Router();
router
    .route('/register')
    .post((0, validateRequest_1.default)(auth_validation_1.authValidations.registeredUserValidationSchema), auth_controllers_1.authControllers.registerUser);
router
    .route('/login')
    .post((0, validateRequest_1.default)(auth_validation_1.authValidations.loginValidationSchema), auth_controllers_1.authControllers.loginUser);
router.post('/refresh-token', (0, validateRequest_1.default)(auth_validation_1.authValidations.refreshTokenValidationSchema), auth_controllers_1.authControllers.refreshToken);
exports.default = router;
