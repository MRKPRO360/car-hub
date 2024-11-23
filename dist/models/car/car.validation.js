"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
// Zod validation schema
const carValidationSchema = zod_1.z.object({
    brand: zod_1.z
        .string({
        required_error: 'A car must have a name!',
        invalid_type_error: 'Car name must be string!',
    })
        .min(1, 'A car must have a name!'),
    model: zod_1.z
        .string({
        required_error: 'A car must have a model name!',
        invalid_type_error: 'Car model name must be string!',
    })
        .min(1, 'A car must have a model name!'),
    year: zod_1.z
        .number()
        .int({ message: 'Year must be an integer.' })
        .min(1886, 'Year must be after 1886.') // Cars didn't exist before this year
        .max(new Date().getFullYear(), 'Year cannot be in the future.')
        .refine((val) => val > 0, { message: 'A car must have a released year!' }),
    price: zod_1.z
        .number()
        .positive({ message: 'Price must be a positive number.' })
        .refine((val) => val > 0, { message: 'A car must have price!' }),
    category: zod_1.z.enum(['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible'], {
        invalid_type_error: '{VALUE} is not appropriate!',
    }),
    description: zod_1.z
        .string({
        required_error: 'A car should have some description!',
        invalid_type_error: 'Description must be string!',
    })
        .min(1, 'A car should have some description!'),
    quantity: zod_1.z
        .number()
        .int({ message: 'Quantity must be an integer.' })
        .nonnegative({ message: 'Quantity must be a positive number or zero.' })
        .refine((val) => val >= 0, {
        message: 'Quantity must be a positive number or zero.',
    }),
    inStock: zod_1.z.boolean({
        invalid_type_error: 'inStock must be a boolean value.',
        required_error: 'inStock is required. Specify whether the product is in stock.',
    }),
    createdAt: zod_1.z
        .date()
        .refine((date) => !isNaN(date.getTime()), { message: 'Invalid date.' })
        .default(() => new Date())
        .optional(),
    updatedAt: zod_1.z
        .date()
        .refine((date) => !isNaN(date.getTime()), { message: 'Invalid date.' })
        .default(() => new Date())
        .optional(),
    isDeleted: zod_1.z.boolean().default(false).optional(),
});
exports.default = carValidationSchema;
