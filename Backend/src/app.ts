import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/error.middleware';
import authRoutes from './modules/auth/auth.routes';
import taskRoutes from './modules/task/task.routes';
import userRoutes from './modules/user/user.routes';

const app = express();

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      process.env.FRONTEND_URL,
      process.env.FRONTEND_PROD_URL
    ].filter((url): url is string => Boolean(url)),
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

export default app;

