"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .trim()
        .email('A valid email address is required')
        .max(255, 'Email must be at most 255 characters'),
    password: zod_1.z.string().min(1, 'Password is required').max(128, 'Password must be at most 128 characters'),
});
exports.signupSchema = zod_1.z
    .object({
    name: zod_1.z.string().trim().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
    email: zod_1.z
        .string()
        .trim()
        .email('A valid email address is required')
        .max(255, 'Email must be at most 255 characters'),
    password: zod_1.z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password must be at most 128 characters'),
    confirmPassword: zod_1.z.string().min(1, 'Please confirm your password'),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});
