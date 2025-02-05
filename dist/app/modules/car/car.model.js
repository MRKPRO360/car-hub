"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const carSchema = new mongoose_1.default.Schema({
    brand: {
        type: String,
        required: [true, 'A car must have a brand name!'],
        trim: true,
    },
    model: {
        type: String,
        required: [true, 'A car must have a model name!'],
        trim: true,
    },
    year: {
        type: Number,
        default: new Date().getFullYear(),
    },
    price: {
        type: Number,
        required: [true, 'A car must have price!'],
    },
    img: {
        type: String,
        required: [true, 'A car must have img!'],
    },
    category: {
        type: String,
        trim: true,
        enum: {
            values: ['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible'],
            message: '{VALUE} is not appropriate!',
        },
    },
    description: {
        type: String,
        required: [true, 'A car should have some description!'],
        trim: true,
    },
    quantity: {
        type: Number,
        required: [
            true,
            'quantity is required. Specify the quantity of the product.',
        ],
        validate: {
            validator: function (value) {
                const isPositive = value >= 0;
                return isPositive;
            },
        },
    },
    inStock: {
        type: Boolean,
        default: true,
    },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: [true, 'Car should have a author info!'],
    },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            delete ret.isDeleted; // removes isDelete from json output :)
        },
    },
});
// PRE SAVE MIDDLEWARE
carSchema.pre('save', function (next) {
    //NOTE: cheking if the quantity is less than 0 the inStcok field will be false otherwise true
    if (this.quantity <= 0)
        this.inStock = false;
    next();
});
// PRE FIND MIDDLEWARE
carSchema.pre('find', function (next) {
    //NOTE: filtering the documents that are not deleted
    this.find({ isDeleted: { $ne: true } });
    next();
});
const Car = mongoose_1.default.model('Car', carSchema);
exports.default = Car;
