import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import type { Application, Request, Response } from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// routes
import authRoutes from './routes/auth.js';
import messageRoutes from './routes/message.js';
import rootRoutes from './routes/root.js';

const app: Application = express();
const PORT: number = Number(process.env['PORT']) || 5000;


// 2. Define __dirname correctly for ESM (replacing path.resolve)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Endpoints
app.use('/', rootRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

if (process.env['NODE_ENV'] === 'production') {
  // Serve built frontend
  // Serve static files from Vite build
  app.use(express.static(path.join(__dirname, '..', '..', 'client', 'dist')));

  // SPA fallback — send index.html for all non-API routes
  app.get(/.*/, (req: Request, res: Response) => {
    // Optional: only send index.html for non-file requests
    if (req.originalUrl.includes('.')) {
      return res.status(404).end(); // let 404 happen for missing files
    }
    res.sendFile(
      path.join(__dirname, '..', '..', 'client', 'dist', 'index.html'),
    );
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
