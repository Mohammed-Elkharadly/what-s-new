import express from 'express';
import type { Application, Request, Response } from 'express';
import cors from 'cors';
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
const PORT: number = ENV.PORT;

if (ENV.CUSTOM_DNS_SERVERS && ENV.CUSTOM_DNS_SERVERS.length > 0) {
  dns.setServers(ENV.CUSTOM_DNS_SERVERS);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors());
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
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();
