import { z } from 'zod';

const getMonthlyTargetValidationSchema = z.object({
  body: z.object({
    month: z.string().min(1, 'Month is required!'),
    year: z.string().min(4, 'Year is required!'),
  }),
});

const updateOrCreaeMonthlyTargetValidationSchema = z.object({
  body: z.object({
    month: z.string().min(1, 'Month is required!'),
    year: z.string().min(4, 'Year is required!'),
    targetAmount: z.string().min(1, 'Target amount is required!'),
  }),
});

export const MonthlyTargetValidationSchema = {
  getMonthlyTargetValidationSchema,
  updateOrCreaeMonthlyTargetValidationSchema,
};
