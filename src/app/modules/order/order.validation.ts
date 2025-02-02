import mongoose from 'mongoose';
import { z } from 'zod';
import orderStatus from './order.constant';

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

const updateOrderValidationSchema = z.object({
  body: z.object({
    status: z.enum([...(orderStatus as [string, ...string[]])]).optional(),
  }),
});

export const orderValidationsSchema = {
  createOrderValidationSchema,
  updateOrderValidationSchema,
};
