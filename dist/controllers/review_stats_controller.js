"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReviewStats = getReviewStats;
const client_1 = require("../generated/prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL must be configured');
}
const prisma = new client_1.PrismaClient({
    adapter: new adapter_pg_1.PrismaPg({ connectionString }),
});
async function getReviewStats(_req, res) {
    try {
        const [pending, approved] = await Promise.all([
            prisma.submission.count({
                where: {
                    status: client_1.SubmissionStatus.PENDING,
                },
            }),
            prisma.submission.count({
                where: {
                    status: client_1.SubmissionStatus.APPROVED,
                },
            }),
        ]);
        res.status(200).json({
            pending,
            approved,
        });
    }
    catch (error) {
        console.error('Failed to fetch review statistics:', error);
        res.status(500).json({
            message: 'Internal server error',
        });
    }
}
