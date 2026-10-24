import { z } from 'zod';

export const submissionSchema = z.object({
	projectName: z
		.string()
		.trim()
		.min(1, 'Project name is required')
		.max(150, 'Project name must be at most 150 characters'),

	repoUrl: z
		.string()
		.trim()
		.url('A valid repository URL is required')
		.max(2048, 'Repository URL must be at most 2048 characters'),

	liveLink: z
		.string()
		.trim()
		.url('A valid live project URL is required')
		.max(2048, 'Live project URL must be at most 2048 characters'),

	description: z.string().trim().min(1, 'Project description is required'),
});

export type SubmissionInput = z.infer<typeof submissionSchema>;

export const reviewSubmissionSchema = z.object({
	status: z.enum(['APPROVED', 'REJECTED'], {
		error: 'Status must be APPROVED or REJECTED',
	}),

	reviewNotes: z.string().trim().max(2000, 'Review notes must be at most 2000 characters').optional(),
});

export type ReviewSubmissionInput = z.infer<typeof reviewSubmissionSchema>;
