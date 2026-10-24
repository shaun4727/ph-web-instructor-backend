"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .trim()
        .email('A valid email address is required')
        .max(255, 'Email must be at most 255 characters'),
    password: zod_1.z.string().min(1, 'Password is required').max(128, 'Password must be at most 128 characters'),
});
