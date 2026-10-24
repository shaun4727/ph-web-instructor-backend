"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = signup;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("../generated/prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const auth_schema_1 = require("../schemas/auth.schema");
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL must be configured');
}
const prisma = new client_1.PrismaClient({
    adapter: new adapter_pg_1.PrismaPg({ connectionString }),
});
async function signup(req, res) {
    const validation = auth_schema_1.signupSchema.safeParse(req.body);
    if (!validation.success) {
        res.status(400).json({
            message: 'Invalid signup data',
            errors: validation.error.flatten().fieldErrors,
        });
        return;
    }
    const { name, email, password } = validation.data;
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
            select: { id: true },
        });
        if (existingUser) {
            res.status(409).json({
                message: 'An account with this email already exists',
            });
            return;
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 12);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                role: client_1.Role.STUDENT,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });
        res.status(201).json({
            message: 'Student account created successfully',
            user,
        });
    }
    catch (error) {
        // Handles a duplicate-email race condition enforced by the database.
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
            res.status(409).json({
                message: 'An account with this email already exists',
            });
            return;
        }
        console.error('Student signup failed:', error);
        res.status(500).json({
            message: 'Internal server error',
        });
    }
}
