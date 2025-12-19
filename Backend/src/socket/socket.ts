// src/socket/socket.ts (Backend)
import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';

let io: Server;

export const initSocket = (server: HTTPServer) => {
  io = new Server(server, {
    cors: {
      origin: [
        'http://localhost:3000',
        'https://collaborative-task-manager-yvd6.vercel.app',
        process.env.FRONTEND_URL,
        process.env.FRONTEND_PROD_URL
      ].filter((url): url is string => Boolean(url)),
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join', (userId: string) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};