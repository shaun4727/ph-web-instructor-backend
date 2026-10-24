"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listReviews = listReviews;
const client_1 = require("../generated/prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL must be configured');
}
const prisma = new client_1.PrismaClient({
    adapter: new adapter_pg_1.PrismaPg({ connectionString }),
});
async function listReviews(req, res) {
    const rawStatus = req.query.status;
    let status;
    if (rawStatus !== undefined) {
        if (typeof rawStatus !== 'string' || !Object.values(client_1.SubmissionStatus).includes(rawStatus)) {
            res.status(400).json({
                message: 'Invalid status. Use PENDING, APPROVED, or REJECTED',
            });
            return;
        }
        status = rawStatus;
    }
    try {
        const submissions = await prisma.submission.findMany({
            ...(status ? { where: { status } } : {}),
            orderBy: {
                submittedAt: 'desc',
            },
            select: {
                id: true,
                projectName: true,
                repoUrl: true,
                liveLink: true,
                description: true,
                status: true,
                submittedAt: true,
                reviewedAt: true,
                reviewNotes: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                reviewer: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        res.status(200).json({
            count: submissions.length,
            submissions,
        });
    }
    catch (error) {
        console.error('Failed to list submissions:', error);
        res.status(500).json({
            message: 'Internal server error',
        });
    }
}
