"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.carControllers = void 0;
const car_services_1 = require("./car.services");
const car_validation_1 = __importDefault(require("./car.validation"));
const getAllCars = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield car_services_1.carServices.getAllCarsFromDB();
        res.status(200).json({
            message: 'Car retrieved successfully!',
            cars: result.length,
            success: true,
            data: result,
        });
    }
    catch (err) {
        res.status(404).json({
            message: 'Something went wrong!',
            success: false,
            error: err,
            stack: err.stack,
        });
    }
});
const getACar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { carId } = req.params;
        const result = yield car_services_1.carServices.getACarFromDB(carId);
        res.status(200).json({
            message: 'Car retrieved successfully!',
            success: true,
            data: result,
        });
    }
    catch (err) {
        res.status(404).json({
            message: 'Something went wrong!',
            success: false,
            error: err,
            stack: err.stack,
        });
    }
});
const createACar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { car } = req.body;
        const validatedData = car_validation_1.default.parse(car);
        const result = yield car_services_1.carServices.creatACarInDB(validatedData);
        res.status(201).json({
            message: 'Car created successfully!',
            success: true,
            data: result,
        });
    }
    catch (err) {
        res.status(400).json({
            message: 'Validation failed!',
            success: false,
            error: err,
            stack: err.stack,
        });
    }
});
const updateACar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedVal = req.body;
        const { carId } = req.params;
        const result = yield car_services_1.carServices.updateACarInDB(carId, updatedVal);
        // SEND RESPONSE IF THE CAR IS NOT FOUND ON DB
        if (!result)
            throw new Error("This car doesn't exist on database 💥");
        res.status(201).json({
            message: 'Car updated successfully!',
            success: true,
            data: result,
        });
    }
    catch (err) {
        res.status(400).json({
            message: 'Car updating failed!',
            success: false,
            error: err,
            stack: err.stack,
        });
    }
});
const deleteACar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { carId } = req.params;
        const result = yield car_services_1.carServices.deleteACarFromDB(carId);
        // SEND RESPONSE IF THE CAR IS NOT FOUND ON DB
        if (!result)
            throw new Error("This car doesn't exist on database 💥");
        // STATUS CODE SHOULD BE 204 BUT PUT 200 FOR ASSIGNMENT INSTRUCTION
        res.status(200).json({
            message: 'Car deleted successfully!',
            success: true,
            data: {},
        });
    }
    catch (err) {
        res.status(400).json({
            message: 'Car deletion failed!',
            success: false,
            error: err,
            stack: err.stack,
        });
    }
});
exports.carControllers = {
    getAllCars,
    getACar,
    updateACar,
    deleteACar,
    createACar,
};
