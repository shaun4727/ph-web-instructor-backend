import type { Request, Response } from 'express';

export function logout(_req: Request, res: Response): void {
	res.clearCookie('accessToken', {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		path: '/',
	});

	res.status(200).json({
		message: 'Logout successful',
	});
}
