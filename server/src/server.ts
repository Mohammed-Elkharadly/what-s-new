import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import type { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// import api routes
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
// import error middleware
import { errorHandler } from './middleware/errorHandler.js';
// import environment variable
import { ENV } from './lib/env.js';
// import DB connection
import { connectDB } from './lib/db.js';
// import dns
import dns from 'node:dns/promises';

const app: Application = express();
const httpServer = createServer(app); // wrap express with httpServer
const PORT: number = ENV.PORT;

// socket.io server
export const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5000'],
    credentials: true,
  },
});

// store online users: userId -> socketId
const onlineUsers = new Map<string, string>();

io.on('connection', (socket) => {
  console.log('user connected: ', socket.id);
  // client send their userId when they connect
  socket.on('user:online', (userId: string) => {
    onlineUsers.set(userId, socket.id);
    // broadcast online users to everyone
    io.emit('users:online', Array.from(onlineUsers.keys()));
  });

  socket.on('disconnect', () => {
    // remove user from online users
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit('users:online', Array.from(onlineUsers.keys()));
    console.log('user disconnected: ', socket.id);
  });
});

// export so message controller can use it
export { onlineUsers };

if (ENV.CUSTOM_DNS_SERVERS && ENV.CUSTOM_DNS_SERVERS.length > 0) {
  dns.setServers(ENV.CUSTOM_DNS_SERVERS);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Serve Static Files From Vite Build (React Frontend)
app.use(express.static(path.join(__dirname, '..', '..', 'client', 'dist')));

// SPA Fallback => send index.html For All Non-API Routes
app.get(/.*/, (req: Request, res: Response) => {
  // Handle Missing Api Routes
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json('Api routes not found');
  }
  // Handle Missing File Exetentions like (style.css, img.png etc..)
  if (req.originalUrl.includes('.')) {
    return res.status(404).end();
  }
  // Any Others Routes will Be Handled By React
  res.sendFile(
    path.join(__dirname, '..', '..', 'client', 'dist', 'index.html'),
  );
});
// Middleware handler for custom error
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB(ENV.MONGO_URI);
    httpServer.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();
