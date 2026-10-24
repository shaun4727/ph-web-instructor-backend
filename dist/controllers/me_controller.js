"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = getMe;
const client_1 = require("../generated/prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL must be configured');
}
const prisma = new client_1.PrismaClient({
    adapter: new adapter_pg_1.PrismaPg({ connectionString }),
});
async function getMe(req, res) {
    if (!req.user) {
        res.status(401).json({
            message: 'Authentication required',
        });
        return;
    }
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });
        if (!user) {
            res.status(401).json({
                message: 'Authenticated user no longer exists',
            });
            return;
        }
        res.status(200).json({ user });
    }
    catch (error) {
        console.error('Failed to retrieve authenticated user:', error);
        res.status(500).json({
            message: 'Unable to retrieve authenticated user',
        });
    }
}
