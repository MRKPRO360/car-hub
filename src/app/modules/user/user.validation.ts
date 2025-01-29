import { z } from 'zod';

const updateUserValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, 'Name must be at least 6 characters long')
      .optional(),
    email: z.string().email('Invalid email address').optional(),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters long')
      .optional(),
    role: z.enum(['user', 'admin']).optional().default('user'),
  }),
});

export const userValidationsSchema = {
  updateUserValidationSchema,
};
