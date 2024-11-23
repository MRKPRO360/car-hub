"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const car_controllers_1 = require("./car.controllers");
const router = express_1.default.Router();
// FOR ALL CAR
router
    .route('/')
    .get(car_controllers_1.carControllers.getAllCars)
    .post(car_controllers_1.carControllers.createACar);
// FOR SINGLE CAR
router
    .route('/:carId')
    .get(car_controllers_1.carControllers.getACar)
    .put(car_controllers_1.carControllers.updateACar)
    .delete(car_controllers_1.carControllers.deleteACar);
exports.default = router;
