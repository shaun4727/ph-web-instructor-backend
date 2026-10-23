import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Role } from '../src/generated/prisma/client';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error('DATABASE_URL is not configured');
}

const adapter = new PrismaPg({
	connectionString,
});

const prisma = new PrismaClient({ adapter });

async function main() {
	const adminEmail = process.env.SEED_ADMIN_EMAIL;
	const adminPassword = process.env.SEED_ADMIN_PASSWORD;
	const mentorEmail = process.env.SEED_MENTOR_EMAIL;
	const mentorPassword = process.env.SEED_MENTOR_PASSWORD;

	if (!adminEmail || !adminPassword || !mentorEmail || !mentorPassword) {
		throw new Error(
			'SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, SEED_MENTOR_EMAIL and SEED_MENTOR_PASSWORD must be configured',
		);
	}

	const adminPasswordHash = await bcrypt.hash(adminPassword, 12);
	const mentorPasswordHash = await bcrypt.hash(mentorPassword, 12);

	await prisma.user.upsert({
		where: { email: adminEmail },
		update: {
			name: 'Administrator',
			role: Role.ADMIN,
		},
		create: {
			name: 'Administrator',
			email: adminEmail,
			passwordHash: adminPasswordHash,
			role: Role.ADMIN,
		},
	});

	await prisma.user.upsert({
		where: { email: mentorEmail },
		update: {
			name: 'Mentor',
			role: Role.MENTOR,
		},
		create: {
			name: 'Mentor',
			email: mentorEmail,
			passwordHash: mentorPasswordHash,
			role: Role.MENTOR,
		},
	});

	console.log('Admin and Mentor seed completed.');
}

main()
	.catch((error: unknown) => {
		console.error('Seed failed:', error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
