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
exports.authServices = void 0;
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = __importDefault(require("../user/user.model"));
const auth_utils_1 = __importDefault(require("./auth.utils"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const registerUserInDB = (file, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // CHECK IF USER EXISTS
    const userExists = yield user_model_1.default.isUserExistsByEmail(payload.email);
    if (userExists)
        throw new AppError_1.default(400, 'User already registered!');
    return yield user_model_1.default.create(Object.assign({ profileImg: (file === null || file === void 0 ? void 0 : file.path) || '' }, payload));
});
const loginUserFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // CHECK IF USER EXISTS
    const user = yield user_model_1.default.isUserExistsByEmail(payload.email);
    if (!user)
        throw new AppError_1.default(404, 'User not found!');
    // CHECK IF USER IS BLOCKED
    if (user.isBlocked)
        throw new AppError_1.default(403, 'User is blocked!');
    // CHECK IF PASSWORD IS CORRECT
    const isPasswordCorrect = yield user_model_1.default.isPasswordMatched(payload.password, user.password);
    if (!isPasswordCorrect)
        throw new AppError_1.default(401, 'Incorrect password!');
    // CHECK IF USER IS DELETED
    if (user.isDeleted)
        throw new AppError_1.default(403, 'User is deleted!');
    const jwtPayload = {
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.default)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, auth_utils_1.default)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
const refreshTokenFromDB = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_refresh_secret);
    const { email } = decoded;
    const user = yield user_model_1.default.isUserExistsByEmail(email);
    if (!user)
        throw new AppError_1.default(404, 'This user is not found!');
    if (user && user.isBlocked === true)
        throw new AppError_1.default(403, 'Unauthorized user!');
    const jwtPayload = {
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.default)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return { accessToken };
});
const changePasswordInDB = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = userData;
    // CHECK IF USER EXISTS
    const user = yield user_model_1.default.isUserExistsByEmail(email);
    if (!user)
        throw new AppError_1.default(404, 'User not found!');
    // CHECK IF USER IS BLOCKED
    if (user.isBlocked)
        throw new AppError_1.default(403, 'User is blocked!');
    // CHECK IF PASSWORD IS CORRECT
    const isPasswordCorrect = yield user_model_1.default.isPasswordMatched(payload.oldPassword, user.password);
    if (!isPasswordCorrect)
        throw new AppError_1.default(400, 'Incorrect password!');
    // CHECK IF USER IS DELETED
    if (user.isDeleted)
        throw new AppError_1.default(403, 'User is deleted!');
    //hash new password
    const newHashedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_rounds));
    const result = yield user_model_1.default.findOneAndUpdate({
        email: userData.email,
        role: userData.role,
    }, {
        password: newHashedPassword,
        passwordChangedAt: new Date(),
    });
    return result;
});
exports.authServices = {
    registerUserInDB,
    loginUserFromDB,
    refreshTokenFromDB,
    changePasswordInDB,
};
