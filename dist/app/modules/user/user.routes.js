"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_constant_1 = __importDefault(require("./user.constant"));
const user_controllers_1 = require("./user.controllers");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.route('/').get((0, auth_1.default)(user_constant_1.default.admin), user_controllers_1.UserControllers.getAllUsers);
const userRoutes = router;
exports.default = userRoutes;
