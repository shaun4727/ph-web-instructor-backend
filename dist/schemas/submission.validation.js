"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewSubmissionSchema = exports.submissionSchema = void 0;
const zod_1 = require("zod");
exports.submissionSchema = zod_1.z.object({
    projectName: zod_1.z
        .string()
        .trim()
        .min(1, 'Project name is required')
        .max(150, 'Project name must be at most 150 characters'),
    repoUrl: zod_1.z
        .string()
        .trim()
        .url('A valid repository URL is required')
        .max(2048, 'Repository URL must be at most 2048 characters'),
    liveLink: zod_1.z
        .string()
        .trim()
        .url('A valid live project URL is required')
        .max(2048, 'Live project URL must be at most 2048 characters'),
    description: zod_1.z.string().trim().min(1, 'Project description is required'),
});
exports.reviewSubmissionSchema = zod_1.z.object({
    status: zod_1.z.enum(['APPROVED', 'REJECTED'], {
        error: 'Status must be APPROVED or REJECTED',
    }),
    reviewNotes: zod_1.z.string().trim().max(2000, 'Review notes must be at most 2000 characters').optional(),
});
