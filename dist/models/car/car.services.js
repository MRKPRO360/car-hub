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
exports.carServices = void 0;
const car_model_1 = __importDefault(require("./car.model"));
const getAllCarsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield car_model_1.default.find();
});
const getACarFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield car_model_1.default.findById(id);
});
const creatACarInDB = (carData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield car_model_1.default.create(carData);
});
const updateACarInDB = (id, updatedVal) => __awaiter(void 0, void 0, void 0, function* () {
    //FIXME: VALIDATION IS NOT WORKING
    return yield car_model_1.default.findByIdAndUpdate(id, { $set: updatedVal }, 
    // Return updated document and run validtators);
    { new: true, runValidators: true, context: 'query ' });
});
const deleteACarFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield car_model_1.default.findByIdAndUpdate(id, { $set: { isDeleted: true } }, 
    // Return updated document and run validtators);
    { new: true, runValidators: true, context: 'query ' });
});
exports.carServices = {
    creatACarInDB,
    getAllCarsFromDB,
    getACarFromDB,
    updateACarInDB,
    deleteACarFromDB,
};
