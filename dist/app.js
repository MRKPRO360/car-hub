"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const car_routes_1 = __importDefault(require("../src/models/car/car.routes"));
const order_routes_1 = __importDefault(require("../src/models/order/order.routes"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const app = (0, express_1.default)();
// CORS
app.use((0, cors_1.default)());
// 3rd PARTY MIDDLEWARE
app.use((0, morgan_1.default)('dev'));
// BODY PARSER
app.use(express_1.default.json());
// ROUTER
app.use('/api/cars', car_routes_1.default);
app.use('/api/orders', order_routes_1.default);
// HELLO RESPONSE
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello World! 👋' });
});
exports.default = app;
