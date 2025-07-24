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
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const getAllCars = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req;
    const result = yield car_services_1.carServices.getAllCarsFromDB(query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Car retrieved successfully!',
        data: result.result,
        meta: result.meta,
    });
}));
const getMyCars = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req;
    const user = req.user;
    const result = yield car_services_1.carServices.getMyCarsFromDB(query, user);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Cars retrieved successfully!',
        data: result.result,
        meta: result.meta,
    });
}));
const getACar = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { carId } = req.params;
    const result = yield car_services_1.carServices.getACarFromDB(carId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Car retrieved successfully!',
        data: result,
    });
}));
const createACar = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield car_services_1.carServices.creatACarInDB(req.body, user);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Car created successfully!',
        data: result,
    });
}));
const updateACar = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedVal = req.body;
    const { carId } = req.params;
    const result = yield car_services_1.carServices.updateACarInDB(carId, updatedVal);
    // SEND RESPONSE IF THE CAR IS NOT FOUND ON DB
    if (!result)
        throw new Error("This car doesn't exist on database 💥");
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Car updated successfully!',
        data: result,
    });
}));
const deleteACar = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { carId } = req.params;
    const result = yield car_services_1.carServices.deleteACarFromDB(carId);
    // SEND RESPONSE IF THE CAR IS NOT FOUND ON DB
    if (!result)
        throw new Error("This car doesn't exist on database 💥");
    (0, sendResponse_1.default)(res, {
        statusCode: 204,
        success: true,
        message: 'Car deleted successfully!',
        data: {},
    });
}));
exports.carControllers = {
    getAllCars,
    getACar,
    getMyCars,
    updateACar,
    deleteACar,
    createACar,
};
