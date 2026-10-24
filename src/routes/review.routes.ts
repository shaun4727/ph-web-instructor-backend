import { Router } from 'express';
import { reviewSubmission } from '../controllers/review_controller';
import { authenticate } from '../middlewares';
import { authorize } from '../middlewares/authorize';
import { Role } from '../generated/prisma/client';
import { listReviews } from '../controllers/list_reviews_controller';
import { getReviewStats } from '../controllers/review_stats_controller';

const reviewRouter = Router();

reviewRouter.patch('/:id', authenticate, authorize(Role.MENTOR), reviewSubmission);
reviewRouter.get('/', authenticate, authorize(Role.MENTOR), listReviews);
reviewRouter.get('/stats', authenticate, authorize(Role.MENTOR), getReviewStats);

export default reviewRouter;
