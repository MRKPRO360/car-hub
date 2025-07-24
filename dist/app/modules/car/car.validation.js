"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.carValidationSchema = void 0;
const zod_1 = require("zod");
// Zod validation schema
const createCarValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
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
            .refine((val) => val > 0, {
            message: 'A car must have a released year!',
        })
            .default(new Date().getFullYear())
            .optional(),
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
        mileage: zod_1.z.number().nonnegative(), // can be 0 or more
        fuelType: zod_1.z.enum(['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG', 'LPG']),
        transmission: zod_1.z.enum(['Automatic', 'Manual']),
        color: zod_1.z.string().trim().optional(),
        engine: zod_1.z.string().trim().optional(),
        horsepower: zod_1.z.number().optional(),
        torque: zod_1.z.number().optional(),
        seatingCapacity: zod_1.z.number().int().positive().optional(),
        features: zod_1.z.array(zod_1.z.string()).optional().default([]),
        vin: zod_1.z.string().trim().optional(),
        condition: zod_1.z
            .enum(['New', 'Used', 'Certified Pre-Owned'])
            .optional()
            .default('New'),
        location: zod_1.z
            .object({
            city: zod_1.z.string().optional(),
            state: zod_1.z.string().optional(),
            country: zod_1.z.string().optional(),
        })
            .optional(),
        views: zod_1.z.number().int().nonnegative().optional().default(0),
    }),
});
const updateCarValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        brand: zod_1.z
            .string({
            required_error: 'A car must have a name!',
            invalid_type_error: 'Car name must be string!',
        })
            .min(1, 'A car must have a name!')
            .optional(),
        model: zod_1.z
            .string({
            required_error: 'A car must have a model name!',
            invalid_type_error: 'Car model name must be string!',
        })
            .min(1, 'A car must have a model name!')
            .optional(),
        year: zod_1.z
            .number()
            .int({ message: 'Year must be an integer.' })
            .min(1886, 'Year must be after 1886.') // Cars didn't exist before this year
            .max(new Date().getFullYear(), 'Year cannot be in the future.')
            .refine((val) => val > 0, {
            message: 'A car must have a released year!',
        })
            .optional(),
        price: zod_1.z
            .number()
            .positive({ message: 'Price must be a positive number.' })
            .refine((val) => val > 0, { message: 'A car must have price!' })
            .optional(),
        category: zod_1.z
            .enum(['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible'], {
            invalid_type_error: '{VALUE} is not appropriate!',
        })
            .optional(),
        description: zod_1.z
            .string({
            required_error: 'A car should have some description!',
            invalid_type_error: 'Description must be string!',
        })
            .min(1, 'A car should have some description!')
            .optional(),
        quantity: zod_1.z
            .number()
            .int({ message: 'Quantity must be an integer.' })
            .nonnegative({ message: 'Quantity must be a positive number or zero.' })
            .refine((val) => val >= 0, {
            message: 'Quantity must be a positive number or zero.',
        })
            .optional(),
        inStock: zod_1.z
            .boolean({
            invalid_type_error: 'inStock must be a boolean value.',
            required_error: 'inStock is required. Specify whether the product is in stock.',
        })
            .optional(),
        mileage: zod_1.z.number().nonnegative().optional(), // can be 0 or more
        fuelType: zod_1.z
            .enum(['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG', 'LPG'])
            .optional(),
        transmission: zod_1.z.enum(['Automatic', 'Manual']).optional(),
        color: zod_1.z.string().trim().optional().optional(),
        engine: zod_1.z.string().trim().optional().optional(),
        horsepower: zod_1.z.number().optional().optional(),
        torque: zod_1.z.number().optional().optional(),
        seatingCapacity: zod_1.z.number().int().positive().optional(),
        features: zod_1.z.array(zod_1.z.string()).optional().default([]),
        vin: zod_1.z.string().trim().optional(),
        condition: zod_1.z
            .enum(['New', 'Used', 'Certified Pre-Owned'])
            .optional()
            .default('New')
            .optional(),
        location: zod_1.z
            .object({
            city: zod_1.z.string().optional(),
            state: zod_1.z.string().optional(),
            country: zod_1.z.string().optional(),
        })
            .optional(),
        views: zod_1.z.number().int().nonnegative().optional().default(0),
    }),
});
exports.carValidationSchema = {
    createCarValidationSchema,
    updateCarValidationSchema,
};
