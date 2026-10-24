"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("../generated/prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const jwt_1 = require("../config/jwt");
const auth_schema_1 = require("../schemas/auth.schema");
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL must be configured');
}
const prisma = new client_1.PrismaClient({
    adapter: new adapter_pg_1.PrismaPg({ connectionString }),
});
async function login(req, res) {
    const validation = auth_schema_1.loginSchema.safeParse(req.body);
    if (!validation.success) {
        res.status(400).json({
            message: 'Invalid login data',
            errors: validation.error.flatten().fieldErrors,
        });
        return;
    }
    const { email, password } = validation.data;
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            res.status(401).json({
                message: 'Invalid email or password',
            });
            return;
        }
        const passwordMatches = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!passwordMatches) {
            res.status(401).json({
                message: 'Invalid email or password',
            });
            return;
        }
        const accessToken = jsonwebtoken_1.default.sign({
            email: user.email,
            role: user.role,
        }, jwt_1.jwtConfig.secret, {
            subject: user.id,
            expiresIn: jwt_1.jwtConfig.expiresIn,
        });
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error('Login failed:', error);
        res.status(500).json({
            message: 'Internal server error',
        });
    }
}
