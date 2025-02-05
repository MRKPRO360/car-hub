"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidationsSchema = void 0;
const zod_1 = require("zod");
const updateUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(1, 'Name must be at least 6 characters long')
            .optional(),
        email: zod_1.z.string().email('Invalid email address').optional(),
        password: zod_1.z
            .string()
            .min(6, 'Password must be at least 6 characters long')
            .optional(),
        role: zod_1.z.enum(['user', 'admin']).optional().default('user'),
    }),
});
exports.userValidationsSchema = {
    updateUserValidationSchema,
};
