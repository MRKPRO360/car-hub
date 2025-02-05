"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const car_controllers_1 = require("./car.controllers");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const car_validation_1 = require("./car.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = __importDefault(require("../user/user.constant"));
const multer_config_1 = require("../../config/multer.config");
const router = express_1.default.Router();
// FOR ALL CAR
router
    .route('/')
    .get(car_controllers_1.carControllers.getAllCars)
    .post((0, auth_1.default)(user_constant_1.default.admin), multer_config_1.multerUpload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(car_validation_1.carValidationSchema.createCarValidationSchema), car_controllers_1.carControllers.createACar);
router
    .route('/my-car')
    .get((0, auth_1.default)(user_constant_1.default.admin, user_constant_1.default.user), car_controllers_1.carControllers.getMyCars);
// FOR SINGLE CAR
router
    .route('/:carId')
    .get(car_controllers_1.carControllers.getACar)
    .patch((0, validateRequest_1.default)(car_validation_1.carValidationSchema.updateCarValidationSchema), car_controllers_1.carControllers.updateACar)
    .delete(car_controllers_1.carControllers.deleteACar);
exports.default = router;
