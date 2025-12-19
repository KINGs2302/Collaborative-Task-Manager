import http from 'http';
import { Server } from 'socket.io';
import app from './app';
// Restart trigger
import dotenv from 'dotenv';
import { initSocket } from './socket/socket';
import { connectDB } from './config/db';

dotenv.config();

const server = http.createServer(app);

connectDB();


initSocket(server);

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
