import { PrismaPg } from '@prisma/adapter-pg';
import type { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma/client';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error('DATABASE_URL must be configured');
}

const prisma = new PrismaClient({
	adapter: new PrismaPg({ connectionString }),
});

export async function getMySubmission(req: Request, res: Response): Promise<void> {
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
	} catch (error) {
		console.error('Failed to retrieve student submission:', error);

		res.status(500).json({
			message: 'Unable to retrieve your submission',
		});
	}
}
