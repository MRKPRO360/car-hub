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
const AppError_1 = __importDefault(require("../../errors/AppError"));
const order_utils_1 = require("./order.utils");
const user_model_1 = __importDefault(require("../user/user.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const getAllOrdersFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const ordersQuery = new QueryBuilder_1.default(order_model_1.default.find().populate({ path: 'cars.car', model: 'Car' }).populate({
        path: 'user',
        model: 'User',
        select: 'name email address city img profileImg phone',
    }), query)
        .search(['name', 'email', 'status'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const meta = yield ordersQuery.countTotal();
    const result = yield ordersQuery.modelQuery;
    return {
        meta,
        result,
    };
});
const getMyOrdersFromDB = (query, userData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({
        email: userData.email,
        role: userData.role,
    }).lean();
    if (!user)
        throw new AppError_1.default(403, 'User not found');
    const ordersQuery = new QueryBuilder_1.default(order_model_1.default.find({ user: user._id })
        .populate({ path: 'cars.car', model: 'Car' })
        .populate({
        path: 'user',
        model: 'User',
        select: 'name email address city img profileImg phone',
    }), query)
        .search(['name', 'email', 'status'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const meta = yield ordersQuery.countTotal();
    const result = yield ordersQuery.modelQuery;
    return {
        meta,
        result,
    };
});
const createOrderInDB = (userData, payload, client_ip) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield user_model_1.default.findOne({
        email: userData.email,
        role: userData.role,
    }).lean();
    if (!((_a = payload === null || payload === void 0 ? void 0 : payload.cars) === null || _a === void 0 ? void 0 : _a.length))
        throw new AppError_1.default(400, 'Order is not specified');
    const cars = payload.cars;
    let totalPrice = 0;
    const carDetails = yield Promise.all(cars.map((item, index) => __awaiter(void 0, void 0, void 0, function* () {
        const car = yield car_model_1.default.findById(item.car);
        if (car && car.isDeleted)
            throw new Error('You can not order a deleted car!');
        if (car && car.quantity < payload.cars[index].quantity)
            throw new Error('Insufficinet stock for this car!');
        if (car) {
            const subtotal = car ? (car.price || 0) * item.quantity : 0;
            totalPrice += subtotal;
            return item;
        }
        else
            throw new AppError_1.default(400, 'The car following this id does not exist');
    })));
    let order = yield order_model_1.default.create({
        user: user === null || user === void 0 ? void 0 : user._id,
        cars: carDetails,
        totalPrice,
    });
    // payment integration
    const shurjopayPayload = {
        amount: totalPrice,
        order_id: order._id,
        currency: 'BDT',
        customer_name: user === null || user === void 0 ? void 0 : user.name,
        customer_address: user === null || user === void 0 ? void 0 : user.address,
        customer_email: user === null || user === void 0 ? void 0 : user.email,
        customer_phone: user === null || user === void 0 ? void 0 : user.phone,
        customer_city: user === null || user === void 0 ? void 0 : user.country,
        client_ip,
    };
    const payment = yield order_utils_1.orderUtils.makePaymentAsync(shurjopayPayload);
    if (payment === null || payment === void 0 ? void 0 : payment.transactionStatus) {
        order = yield order.updateOne({
            transaction: {
                id: payment.sp_order_id,
                transactionStatus: payment.transactionStatus,
            },
        });
    }
    return payment.checkout_url;
});
const verifyPayment = (order_id) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const verifiedPayment = yield order_utils_1.orderUtils.verifyPaymentAsync(order_id);
        if (!verifiedPayment.length)
            throw new AppError_1.default(400, 'Payment verification failed');
        const order = yield order_model_1.default.findOneAndUpdate({
            'transaction.id': order_id,
        }, {
            'transaction.bank_status': verifiedPayment[0].bank_status,
            'transaction.sp_code': verifiedPayment[0].sp_code,
            'transaction.sp_message': verifiedPayment[0].sp_message,
            'transaction.transactionStatus': verifiedPayment[0].transaction_status,
            'transaction.method': verifiedPayment[0].method,
            'transaction.date_time': verifiedPayment[0].date_time,
            status: verifiedPayment[0].bank_status == 'Success'
                ? 'PAID'
                : verifiedPayment[0].bank_status == 'Failed'
                    ? 'PENDING'
                    : verifiedPayment[0].bank_status == 'Cancel'
                        ? 'CANCELLED'
                        : '',
        }, {
            new: true,
            session,
        });
        if (!order) {
            throw new AppError_1.default(404, 'Order not found');
        }
        for (const orderCar of order.cars) {
            const car = yield car_model_1.default.findById(orderCar.car).session(session);
            if (!car)
                throw new AppError_1.default(404, 'Car not found');
            if (!car.inStock)
                throw new AppError_1.default(400, `Car ${car.model} is out of stock`);
            if (orderCar.quantity > car.quantity) {
                throw new AppError_1.default(400, `Not enough stock for ${car.model}`);
            }
        }
        // Iterate through cars and update their stock
        yield Promise.all(order.cars.map((orderCar) => __awaiter(void 0, void 0, void 0, function* () {
            const updatedCar = yield car_model_1.default.findOneAndUpdate({ _id: orderCar.car }, // Find car by ID
            { $inc: { quantity: -orderCar.quantity } }, // Reduce quantity
            { new: true, session });
            if (updatedCar && updatedCar.quantity === 0) {
                yield car_model_1.default.findByIdAndUpdate(orderCar.car, { inStock: false }, { session });
            }
        })));
        yield session.commitTransaction();
        session.endSession();
        return verifiedPayment;
    }
    catch (err) {
        yield session.abortTransaction();
        session.endSession();
        throw new AppError_1.default(400, err.message);
    }
});
const deleteAnOrder = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield order_model_1.default.findByIdAndDelete(id);
});
const updateAnOrder = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield order_model_1.default.findById(id);
    if ((orders === null || orders === void 0 ? void 0 : orders.status) === 'PAID') {
        const updatedOrder = yield order_model_1.default.findByIdAndUpdate(id, { status: 'COMPLETED' }, { new: true });
        if (!updatedOrder)
            throw new AppError_1.default(400, 'Order not found!');
    }
    else {
        throw new AppError_1.default(400, 'You can not change status!');
    }
});
const claculateRevenueFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield order_model_1.default.aggregate([
        // FINDING CARS FROM CARS COLLECTION
        {
            $lookup: {
                from: 'cars',
                localField: 'car',
                foreignField: '_id',
                as: 'carDetails',
            },
        },
        // FLATTENING CARS ARRAY
        {
            $unwind: '$carDetails',
        },
        //  CALCULATING PRICE BY QUANTITY FOR EACH CAR
        {
            $addFields: {
                carPriceByQt: {
                    $multiply: ['$carDetails.quantity', '$carDetails.price'],
                },
            },
        },
        // GROUPING ALL DOCUMENTS
        {
            $group: {
                _id: null,
                // CALCULATING TOTAL REVENUE
                totalRevenue: { $sum: '$carPriceByQt' },
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
exports.orderServices = {
    getAllOrdersFromDB,
    createOrderInDB,
    deleteAnOrder,
    updateAnOrder,
    claculateRevenueFromDB,
    verifyPayment,
    getMyOrdersFromDB,
};
