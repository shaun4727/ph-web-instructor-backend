"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMySubmission = getMySubmission;
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("../generated/prisma/client");
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL must be configured');
}
const prisma = new client_1.PrismaClient({
    adapter: new adapter_pg_1.PrismaPg({ connectionString }),
});
async function getMySubmission(req, res) {
    if (!req.user) {
        res.status(401).json({
            message: 'Authentication required',
        });
        return;
    }
    try {
        const submission = await prisma.submission.findUnique({
            where: {
                userId: req.user.id,
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
                reviewer: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        res.status(200).json({
            submission,
        });
    }
    catch (error) {
        console.error('Failed to retrieve student submission:', error);
        res.status(500).json({
            message: 'Unable to retrieve your submission',
        });
    }
}
