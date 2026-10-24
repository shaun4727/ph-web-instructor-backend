import type { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { submissionSchema } from '../schemas/submission.validation';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error('DATABASE_URL must be configured');
}

const prisma = new PrismaClient({
	adapter: new PrismaPg({ connectionString }),
});

export async function createSubmission(req: Request, res: Response): Promise<void> {
	const validation = submissionSchema.safeParse(req.body);

	if (!validation.success) {
		res.status(400).json({
			message: 'Invalid submission data',
			errors: validation.error.flatten().fieldErrors,
		});
		return;
	}

	if (!req.user) {
		res.status(401).json({
			message: 'Authentication required',
		});
		return;
	}

	try {
		const submission = await prisma.submission.create({
			data: {
				...validation.data,
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
			},
		});

		res.status(201).json({
			message: 'Submission created successfully',
			submission,
		});
	} catch (error) {
		if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
			res.status(409).json({
				message: 'You have already submitted a project',
			});
			return;
		}

		console.error('Submission creation failed:', error);

		res.status(500).json({
			message: 'Internal server error',
		});
	}
}
