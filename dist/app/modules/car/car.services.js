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
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const car_constant_1 = require("./car.constant");
const car_model_1 = __importDefault(require("./car.model"));
const user_model_1 = __importDefault(require("../user/user.model"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const getAllCarsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const carsQuery = new QueryBuilder_1.default(car_model_1.default.find().populate({ path: 'author', model: 'User' }), query)
        .search(car_constant_1.carSearchableFileds)
        .filter()
        .sort()
        .paginate()
        .fields();
    const meta = yield carsQuery.countTotal();
    const result = yield carsQuery.modelQuery;
    return {
        meta,
        result,
    };
});
const getMyCarsFromDB = (query, userData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({
        email: userData.email,
        role: userData.role,
    });
    if (!user)
        throw new AppError_1.default(403, 'User not found');
    const carsQuery = new QueryBuilder_1.default(car_model_1.default.find({ author: user._id }).populate({ path: 'author', model: 'User' }), query)
        .search(car_constant_1.carSearchableFileds)
        .filter()
        .sort()
        .paginate()
        .fields();
    const meta = yield carsQuery.countTotal();
    const result = yield carsQuery.modelQuery;
    return {
        meta,
        result,
    };
});
const getACarFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield car_model_1.default.findById(id);
});
const creatACarInDB = (payload, userData) => __awaiter(void 0, void 0, void 0, function* () {
    //APPLY THIS LOGIC
    // IF CAR BRAND AND NAME IS EXISTS AND USER WANTS TO ADD ANOTHER CAR THEN SHOW AN ERROR OR ADD THE STOCK
    const user = yield user_model_1.default.findOne({
        email: userData.email,
        role: userData.role,
    });
    if (!user)
        throw new AppError_1.default(403, 'User not found');
    return yield car_model_1.default.create(Object.assign(Object.assign({}, payload), { images: payload.images, coverImage: payload.coverImage, author: user._id }));
});
const updateACarInDB = (id, updatedVal) => __awaiter(void 0, void 0, void 0, function* () {
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
    getMyCarsFromDB,
};
