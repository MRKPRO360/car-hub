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
exports.UserServices = void 0;
const user_model_1 = __importDefault(require("./user.model"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const getAllUsersFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.default.find();
});
const getSingleUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.default.findById(id);
});
const getMeFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.default.findOne({ email: payload.email });
});
const updateUserInDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(id);
    if (!user)
        throw new AppError_1.default(400, 'User not found!');
    return yield user_model_1.default.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
});
const deactivateUserInDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(id);
    if (!user)
        throw new AppError_1.default(400, 'User not found!');
    if (user.isBlocked)
        throw new AppError_1.default(400, 'User is already blocked');
    return yield user_model_1.default.findByIdAndUpdate(id, { isBlocked: true }, {
        new: true,
        runValidators: true,
    });
});
const deleteUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(id);
    if (!user)
        throw new AppError_1.default(400, 'User not found!');
    return yield user_model_1.default.findByIdAndUpdate(id, {
        isDeleted: true,
    }, {
        new: true,
        runValidators: true,
    });
});
exports.UserServices = {
    getAllUsersFromDB,
    updateUserInDB,
    deleteUserFromDB,
    deactivateUserInDB,
    getSingleUserFromDB,
    getMeFromDB,
};
