import { Router } from 'express';
import { getMySubmission } from '../controllers/my_submission_controller';
import { createSubmission } from '../controllers/submission_controller';
import { Role } from '../generated/prisma/client';
import { authenticate } from '../middlewares';
import { authorize } from '../middlewares/authorize';

const submissionRouter = Router();

submissionRouter.post('/', authenticate, authorize(Role.STUDENT), createSubmission);
submissionRouter.get('/', authenticate, authorize(Role.STUDENT), getMySubmission);

export default submissionRouter;
