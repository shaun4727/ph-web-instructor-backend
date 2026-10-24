import { Router } from 'express';
import { login } from '../controllers/auth_controller';
import { signup } from '../controllers/signup_controller';
import { logout } from '../controllers/logout_controller';
import { getMe } from '../controllers/me_controller';
import { authenticate } from '../middlewares';

const authRouter = Router();

authRouter.post('/login', login);
authRouter.post('/signup', signup);
authRouter.post('/logout', logout);
authRouter.get('/me', authenticate, getMe);

export default authRouter;
