import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './modules/auth/auth.routes';
import taskRoutes from './modules/task/task.routes';
import userRoutes from './modules/user/user.routes';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://collaborative-task-manager-yvd6.vercel.app',
      process.env.FRONTEND_URL,
      process.env.FRONTEND_PROD_URL
    ].filter((url): url is string => Boolean(url)),
    credentials: true,
  })
);



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.get("/", (req, res) => {
  res.json({ status: "Backend running" });
});
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'OK' });
});


app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'Internal Server Error',
  });
});

export default app;
