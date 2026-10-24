import 'dotenv/config';

const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

if (!jwtSecret || jwtSecret.trim().length === 0) {
	throw new Error('JWT_SECRET must be configured');
}

if (!jwtExpiresIn || jwtExpiresIn.trim().length === 0) {
	throw new Error('JWT_EXPIRES_IN must be configured');
}

export const jwtConfig = {
	secret: jwtSecret,
	expiresIn: jwtExpiresIn,
} as const;
