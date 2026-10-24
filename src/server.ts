import 'dotenv/config';
import express from 'express';
import authRouter from './routes/auth.routes';
import submissionRouter from './routes/submission.routes';
import reviewRouter from './routes/review.routes';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

const PORT = Number(process.env.PORT) || 5000;

app.get('/health', (_req, res) => {
	res.status(200).json({
		success: true,
		message: 'Backend is running',
	});
});
app.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true,
		methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	}),
);
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRouter);
app.use('/api/submissions', submissionRouter);
app.use('/api/mentor/reviews', reviewRouter);

app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});
