import mongoose from 'mongoose';
import { z } from 'zod';

// Zod schema for validating ObjectId
const objectIdSchema = z
  .string()
  .refine((value) => mongoose.Types.ObjectId.isValid(value), {
    message: 'Invalid ObjectId',
  });

// Zod schema for validating IOrder
const createOrderValidationSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required!',
      invalid_type_error: 'Email must be string!',
    })
    .email('Invalid email format!'),
  car: objectIdSchema,
  quantity: z
    .number()
    .min(1, 'Quantity must be at least 1!')
    .nonnegative('Quantity can not be negative!')
    .int('Quantity must be an integer!'),
  totalPrice: z
    .number()
    .min(0, 'Total price cannot be negative!')
    .nonnegative('Quantity can not be negative!'),
});

export const orderValidationsSchema = {
  createOrderValidationSchema,
};
