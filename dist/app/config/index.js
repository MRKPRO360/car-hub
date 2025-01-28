"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({
    path: process.cwd() + '/.env',
});
exports.default = {
    database_password: process.env.DATABASE_PASSWORD,
    database_url: process.env.DATABASE_URL,
    port: process.env.PORT,
    node_env: process.env.NODE_ENV,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
};
