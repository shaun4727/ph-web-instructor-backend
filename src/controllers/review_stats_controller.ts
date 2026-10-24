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

export async function getReviewStats(_req: Request, res: Response): Promise<void> {
	try {
		const [pending, approved] = await Promise.all([
			prisma.submission.count({
				where: {
					status: SubmissionStatus.PENDING,
				},
			}),
			prisma.submission.count({
				where: {
					status: SubmissionStatus.APPROVED,
				},
			}),
		]);

		res.status(200).json({
			pending,
			approved,
		});
	} catch (error) {
		console.error('Failed to fetch review statistics:', error);

		res.status(500).json({
			message: 'Internal server error',
		});
	}
}
