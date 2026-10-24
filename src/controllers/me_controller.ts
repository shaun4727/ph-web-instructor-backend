import type { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error('DATABASE_URL must be configured');
}

const prisma = new PrismaClient({
	adapter: new PrismaPg({ connectionString }),
});

export async function getMe(req: Request, res: Response): Promise<void> {
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
	} catch (error) {
		console.error('Failed to retrieve authenticated user:', error);

		res.status(500).json({
			message: 'Unable to retrieve authenticated user',
		});
	}
}
