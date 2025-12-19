import { Server } from 'socket.io';
import http from 'http';

let io: Server;

const allowedOrigins = [
  process.env.FRONTEND_URL,        
  process.env.FRONTEND_PROD_URL,   
].filter((origin): origin is string => Boolean(origin));

export const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    },
  });
  // io = new Server(server, {
  //   cors: {
  //     origin: '*',
  //     credentials: true,
  //     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  //   },
  // });

  io.on('connection', (socket) => {
    console.log('🟢 Socket connected:', socket.id);

    socket.on('join-task', (taskId: string) => {
      socket.join(taskId);
      console.log(`Socket ${socket.id} joined task ${taskId}`);
    });

    socket.on('task-updated', (data) => {
      socket.to(data.taskId).emit('task-updated', data);
    });

    socket.on('disconnect', () => {
      console.log('🔴 Socket disconnected:', socket.id);
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


// beacuse cors is not working
// import { Server } from 'socket.io';
// import http from 'http';

// let io: Server;

// export const initSocket = (server: http.Server) => {
//   io = new Server(server);

//   io.on('connection', (socket) => {
//     console.log('🟢 Socket connected:', socket.id);

//     socket.on('join-task', (taskId: string) => {
//       socket.join(taskId);
//       console.log(`Socket ${socket.id} joined task ${taskId}`);
//     });

//     socket.on('task-updated', (data) => {
//       socket.to(data.taskId).emit('task-updated', data);
//     });

//     socket.on('disconnect', () => {
//       console.log('🔴 Socket disconnected:', socket.id);
//     });
//   });

//   return io;
// };

// export const getIO = (): Server => {
//   if (!io) {
//     throw new Error('Socket.io not initialized');
//   }
//   return io;
// };
