import type { Request, Response } from 'express';
import { PrismaClient, SubmissionStatus } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error('DATABASE_URL must be configured');
}

const prisma = new PrismaClient({
	adapter: new PrismaPg({ connectionString }),
});

export async function listReviews(req: Request, res: Response): Promise<void> {
	const rawStatus = req.query.status;

	let status: SubmissionStatus | undefined;

	if (rawStatus !== undefined) {
		if (typeof rawStatus !== 'string' || !Object.values(SubmissionStatus).includes(rawStatus as SubmissionStatus)) {
			res.status(400).json({
				message: 'Invalid status. Use PENDING, APPROVED, or REJECTED',
			});
			return;
		}

		status = rawStatus as SubmissionStatus;
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
	} catch (error) {
		console.error('Failed to list submissions:', error);

		res.status(500).json({
			message: 'Internal server error',
		});
	}
}
