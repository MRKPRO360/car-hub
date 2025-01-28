"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = __importDefault(require("./routes"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const app = (0, express_1.default)();
// CORS
//SHOULD HAVE TO CHANGE THE ORIGIN WHEN PRODUCTION!
app.use((0, cors_1.default)({
    origin: ["http//localhost:5173"],
    credentials: true,
}));
// 3rd PARTY MIDDLEWARE
app.use((0, morgan_1.default)("dev"));
// BODY PARSER
app.use(express_1.default.json());
// ROUTER
app.use("/api/v1", routes_1.default);
// HELLO RESPONSE
app.get("/", (req, res) => {
    res.status(200).json({ message: "Hello World! 👋" });
});
// GLOBAL ERROR HANDLER
app.use(globalErrorHandler_1.default);
// NOT FOUND
app.use(notFound_1.default);
exports.default = app;
