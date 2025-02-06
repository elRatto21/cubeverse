import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import scrambleRoutes from './routes/scrambleRoutes';
import solveRoutes from './routes/solveRoutes';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.set('trust proxy', 1);

app.use('/api/auth', authRoutes);
app.use('/api/cube', scrambleRoutes)
app.use('/api/solve', solveRoutes)

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

export default app;