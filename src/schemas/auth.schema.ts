import { z } from 'zod';

export const loginSchema = z.object({
	email: z
		.string()
		.trim()
		.email('A valid email address is required')
		.max(255, 'Email must be at most 255 characters'),

	password: z.string().min(1, 'Password is required').max(128, 'Password must be at most 128 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z
	.object({
		name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),

		email: z
			.string()
			.trim()
			.email('A valid email address is required')
			.max(255, 'Email must be at most 255 characters'),

		password: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.max(128, 'Password must be at most 128 characters'),

		confirmPassword: z.string().min(1, 'Please confirm your password'),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

export type SignupInput = z.infer<typeof signupSchema>;
