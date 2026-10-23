import 'dotenv/config';
import express from 'express';

const app = express();

const PORT = Number(process.env.PORT) || 5000;

app.get('/health', (_req, res) => {
	res.status(200).json({
		success: true,
		message: 'Backend is running',
	});
});

app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});
