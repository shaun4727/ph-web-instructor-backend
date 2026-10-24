"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewSubmission = reviewSubmission;
const client_1 = require("../generated/prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const submission_validation_1 = require("../schemas/submission.validation");
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL must be configured');
}
const prisma = new client_1.PrismaClient({
    adapter: new adapter_pg_1.PrismaPg({ connectionString }),
});
async function reviewSubmission(req, res) {
    const validation = submission_validation_1.reviewSubmissionSchema.safeParse(req.body);
    if (!validation.success) {
        res.status(400).json({
            message: 'Invalid review data',
            errors: validation.error.flatten().fieldErrors,
        });
        return;
    }
    const submissionId = req.params.id;
    if (typeof submissionId !== 'string') {
        res.status(400).json({
            message: 'A valid submission ID is required',
        });
        return;
    }
    if (!req.user) {
        res.status(401).json({
            message: 'Authentication required',
        });
        return;
    }
    const { status, reviewNotes } = validation.data;
    try {
        const existingSubmission = await prisma.submission.findUnique({
            where: { id: submissionId },
            select: {
                id: true,
                status: true,
            },
        });
        if (!existingSubmission) {
            res.status(404).json({
                message: 'Submission not found',
            });
            return;
        }
        if (existingSubmission.status !== client_1.SubmissionStatus.PENDING) {
            res.status(409).json({
                message: 'Only pending submissions can be reviewed',
            });
            return;
        }
        const updatedSubmission = await prisma.submission.update({
            where: { id: submissionId },
            data: {
                status,
                reviewNotes,
                reviewedAt: new Date(),
                reviewedBy: req.user.id,
            },
            select: {
                id: true,
                projectName: true,
                status: true,
                reviewNotes: true,
                reviewedAt: true,
                reviewedBy: true,
            },
        });
        res.status(200).json({
            message: `Submission ${status.toLowerCase()} successfully`,
            submission: updatedSubmission,
        });
    }
    catch (error) {
        console.error('Submission review failed:', error);
        res.status(500).json({
            message: 'Internal server error',
        });
    }
}
