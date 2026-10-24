import type { NextFunction, Request, Response } from 'express';
import { Role } from '../generated/prisma/client';

export function authorize(...allowedRoles: Role[]) {
	return (req: Request, res: Response, next: NextFunction): void => {
		if (!req.user) {
			res.status(401).json({
				message: 'Authentication required',
			});
			return;
		}

		if (!allowedRoles.includes(req.user.role)) {
			res.status(403).json({
				message: 'You do not have permission to access this resource',
			});
			return;
		}

		next();
	};
}
