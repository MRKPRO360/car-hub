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
exports.orderServices = void 0;
const car_model_1 = __importDefault(require("../car/car.model"));
const order_model_1 = __importDefault(require("./order.model"));
const getAllOrdersFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield order_model_1.default.find();
});
const createOrderInDB = (orderData) => __awaiter(void 0, void 0, void 0, function* () {
    const car = yield car_model_1.default.findById(orderData.car);
    // RETURN ERROR IF NO CAR EXISTS
    if (!car) {
        throw new Error("Car not found!");
    }
    // CHECK IF THE CAR IS DELETED
    if (car.isDeleted)
        throw new Error("You can not order a deleted car!");
    // CHECK IF THE CAR QUANTITY IS AVAILABLE
    if (car.quantity < orderData.quantity)
        throw new Error("Insufficinet stock for this car!");
    // REDUCING CAR QUANTITY
    car.quantity -= orderData.quantity;
    // PRE SAVE MIDDLEWARE WILL SET inStock TO false
    yield car.save();
    return yield order_model_1.default.create(orderData);
});
const claculateRevenueFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield order_model_1.default.aggregate([
        // FINDING CARS FROM CARS COLLECTION
        {
            $lookup: {
                from: "cars",
                localField: "car",
                foreignField: "_id",
                as: "carDetails",
            },
        },
        // FLATTENING CARS ARRAY
        {
            $unwind: "$carDetails",
        },
        //  CALCULATING PRICE BY QUANTITY FOR EACH CAR
        {
            $addFields: {
                carPriceByQt: {
                    $multiply: ["$carDetails.quantity", "$carDetails.price"],
                },
            },
        },
        // GROUPING ALL DOCUMENTS
        {
            $group: {
                _id: null,
                // CALCULATING TOTAL REVENUE
                totalRevenue: { $sum: "$carPriceByQt" },
            },
        },
        {
            $project: {
                _id: 0,
                totalRevenue: 1,
            },
        },
    ]).exec();
});
const getOrderWithCarFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    //NOTE: Fetch an order with the associated car details
    return yield order_model_1.default.find().populate("car");
});
exports.orderServices = {
    getAllOrdersFromDB,
    createOrderInDB,
    claculateRevenueFromDB,
    getOrderWithCarFromDB,
};
