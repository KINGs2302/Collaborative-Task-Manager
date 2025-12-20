import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './modules/auth/auth.routes';
import taskRoutes from './modules/task/task.routes';
import userRoutes from './modules/user/user.routes';
import notificationRoutes from './modules/notification/notification.routes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.set('trust proxy', 1);

const allowedOrigins = [
  "http://localhost:3000",
  "https://collaborative-task-manager-yvd6.vercel.app",
  process.env.FRONTEND_URL,
  process.env.FRONTEND_PROD_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error('❌ Blocked by CORS:', origin);
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'Accept'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie'],
    optionsSuccessStatus: 204,
  })
);
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin) return callback(null, true);

//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       } else {
//         console.error(`❌ CORS Blocked: ${origin}. Allowed: ${allowedOrigins.join(', ')}`);
//         return callback(new Error('Not allowed by CORS'));
//       }
//     },
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
//   })
// );

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.get("/", (req, res) => {
  res.json({ status: "Backend running" });
});
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);

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
