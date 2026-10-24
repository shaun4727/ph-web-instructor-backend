import type { NextFunction, Request, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt';
import { Role } from '../generated/prisma/client';

interface AccessTokenPayload extends JwtPayload {
	sub: string;
	email: string;
	role: Role;
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
	// 1. Prefer the HttpOnly cookie; support Bearer tokens as fallback.
	const cookieToken: unknown = req.cookies?.accessToken;
	const authorization = req.headers.authorization;

	const bearerToken = authorization?.startsWith('Bearer ') ? authorization.slice('Bearer '.length).trim() : undefined;

	const token = typeof cookieToken === 'string' && cookieToken.length > 0 ? cookieToken : bearerToken;

	// 2. Reject requests without a token.
	if (!token) {
		res.status(401).json({
			message: 'Authentication token is required',
		});
		return;
	}

	try {
		// 3. Verify the token's signature and expiry.
		const decoded = jwt.verify(token, jwtConfig.secret);

		// 4. Validate the required JWT payload fields.
		if (
			typeof decoded === 'string' ||
			typeof decoded.sub !== 'string' ||
			typeof decoded.email !== 'string' ||
			typeof decoded.role !== 'string' ||
			!Object.values(Role).includes(decoded.role as Role)
		) {
			res.status(401).json({
				message: 'Invalid authentication token',
			});
			return;
		}

		const payload = decoded as AccessTokenPayload;

		// 5. Attach the authenticated user to the request.
		req.user = {
			id: payload.sub,
			email: payload.email,
			role: payload.role,
		};

		// 6. Continue to the next middleware/controller.
		next();
	} catch {
		res.status(401).json({
			message: 'Invalid or expired authentication token',
		});
	}
}
