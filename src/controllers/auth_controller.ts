import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { jwtConfig } from '../config/jwt';
import { loginSchema } from '../schemas/auth.schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error('DATABASE_URL must be configured');
}

const prisma = new PrismaClient({
	adapter: new PrismaPg({ connectionString }),
});

export async function login(req: Request, res: Response): Promise<void> {
	const validation = loginSchema.safeParse(req.body);

	if (!validation.success) {
		res.status(400).json({
			message: 'Invalid login data',
			errors: validation.error.flatten().fieldErrors,
		});
		return;
	}

	const { email, password } = validation.data;

	try {
		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			res.status(401).json({
				message: 'Invalid email or password',
			});
			return;
		}

		const passwordMatches = await bcrypt.compare(password, user.passwordHash);

		if (!passwordMatches) {
			res.status(401).json({
				message: 'Invalid email or password',
			});
			return;
		}

		const accessToken = jwt.sign(
			{
				email: user.email,
				role: user.role,
			},
			jwtConfig.secret,
			{
				subject: user.id,
				expiresIn: jwtConfig.expiresIn as jwt.SignOptions['expiresIn'],
			},
		);

		res.cookie('accessToken', accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			path: '/',
			maxAge: 24 * 60 * 60 * 1000,
		});

		res.status(200).json({
			message: 'Login successful',
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
		});
	} catch (error) {
		console.error('Login failed:', error);

		res.status(500).json({
			message: 'Internal server error',
		});
	}
}
