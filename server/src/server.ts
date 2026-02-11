import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import type { Application, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import messageRoutes from './routes/message.js';
import path from 'node:path';
const app: Application = express();

app.use(cors());
app.use(express.json());

const __dirname = path.resolve(); // it returns the absolute path

// Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

if (process.env['NODE_ENV'] === 'production') {
  // __dirname = C:\Users\Cm\Downloads\chat-app\server + ../client/dist
  // output: C:\Users\Cm\Downloads\chat-app\client\dist
  app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
  });
}
console.log(path.join(__dirname, '../client', 'dist'));

const PORT: number = Number(process.env['PORT']) || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
