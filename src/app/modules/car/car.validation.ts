import { z } from 'zod';

// Zod validation schema
const createCarValidationSchema = z.object({
  body: z.object({
    brand: z
      .string({
        required_error: 'A car must have a name!',
        invalid_type_error: 'Car name must be string!',
      })
      .min(1, 'A car must have a name!'),

    model: z
      .string({
        required_error: 'A car must have a model name!',
        invalid_type_error: 'Car model name must be string!',
      })
      .min(1, 'A car must have a model name!'),

    year: z
      .number()
      .int({ message: 'Year must be an integer.' })
      .min(1886, 'Year must be after 1886.') // Cars didn't exist before this year
      .max(new Date().getFullYear(), 'Year cannot be in the future.')
      .refine((val) => val > 0, {
        message: 'A car must have a released year!',
      })
      .default(new Date().getFullYear())
      .optional(),

    price: z
      .number()
      .positive({ message: 'Price must be a positive number.' })
      .refine((val) => val > 0, { message: 'A car must have price!' }),

    category: z.enum(['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible'], {
      invalid_type_error: '{VALUE} is not appropriate!',
    }),

    description: z
      .string({
        required_error: 'A car should have some description!',
        invalid_type_error: 'Description must be string!',
      })
      .min(1, 'A car should have some description!'),

    quantity: z
      .number()
      .int({ message: 'Quantity must be an integer.' })
      .nonnegative({ message: 'Quantity must be a positive number or zero.' })
      .refine((val) => val >= 0, {
        message: 'Quantity must be a positive number or zero.',
      }),
    mileage: z.number().nonnegative(), // can be 0 or more
    fuelType: z.enum(['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG', 'LPG']),
    transmission: z.enum(['Automatic', 'Manual']),
    color: z.string().trim().optional(),
    engine: z.string().trim().optional(),
    horsepower: z.number().optional(),
    torque: z.number().optional(),
    seatingCapacity: z.number().int().positive().optional(),
    features: z.array(z.string()),
    vin: z.string().trim().optional(),
    condition: z
      .enum(['New', 'Used', 'Certified Pre-Owned'])
      .optional()
      .default('New'),
    location: z
      .object({
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
      })
      .optional(),
    views: z.number().int().nonnegative().optional().default(0),
  }),
});

const updateCarValidationSchema = z.object({
  body: z.object({
    brand: z
      .string({
        required_error: 'A car must have a name!',
        invalid_type_error: 'Car name must be string!',
      })
      .min(1, 'A car must have a name!')
      .optional(),

    model: z
      .string({
        required_error: 'A car must have a model name!',
        invalid_type_error: 'Car model name must be string!',
      })
      .min(1, 'A car must have a model name!')
      .optional(),

    year: z
      .number()
      .int({ message: 'Year must be an integer.' })
      .min(1886, 'Year must be after 1886.') // Cars didn't exist before this year
      .max(new Date().getFullYear(), 'Year cannot be in the future.')
      .refine((val) => val > 0, {
        message: 'A car must have a released year!',
      })
      .optional(),

    price: z
      .number()
      .positive({ message: 'Price must be a positive number.' })
      .refine((val) => val > 0, { message: 'A car must have price!' })
      .optional(),

    category: z
      .enum(['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible'], {
        invalid_type_error: '{VALUE} is not appropriate!',
      })
      .optional(),

    description: z
      .string({
        required_error: 'A car should have some description!',
        invalid_type_error: 'Description must be string!',
      })
      .min(1, 'A car should have some description!')
      .optional(),

    quantity: z
      .number()
      .int({ message: 'Quantity must be an integer.' })
      .nonnegative({ message: 'Quantity must be a positive number or zero.' })
      .refine((val) => val >= 0, {
        message: 'Quantity must be a positive number or zero.',
      })
      .optional(),

    inStock: z
      .boolean({
        invalid_type_error: 'inStock must be a boolean value.',
        required_error:
          'inStock is required. Specify whether the product is in stock.',
      })
      .optional(),

    mileage: z.number().nonnegative().optional(), // can be 0 or more
    fuelType: z
      .enum(['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG', 'LPG'])
      .optional(),
    transmission: z.enum(['Automatic', 'Manual']).optional(),
    color: z.string().trim().optional().optional(),
    engine: z.string().trim().optional().optional(),
    horsepower: z.number().optional().optional(),
    torque: z.number().optional().optional(),
    seatingCapacity: z.number().int().positive().optional(),
    features: z.array(z.string()).optional().default([]),
    vin: z.string().trim().optional(),
    condition: z
      .enum(['New', 'Used', 'Certified Pre-Owned'])
      .optional()
      .default('New')
      .optional(),
    location: z
      .object({
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
      })
      .optional(),
    views: z.number().int().nonnegative().optional().default(0),
  }),
});

export const carValidationSchema = {
  createCarValidationSchema,
  updateCarValidationSchema,
};
