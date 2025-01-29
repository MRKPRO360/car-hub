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
  body: z.object({
    cars: z.array(
      z.object({
        car: objectIdSchema,
        quantity: z.number().int().positive(),
      })
    ),
  }),
});

export const orderValidationsSchema = {
  createOrderValidationSchema,
};
