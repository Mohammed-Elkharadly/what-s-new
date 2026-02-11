import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import type { Application } from 'express';
import cors from 'cors';
const app: Application = express();
import authRoutes from './routes/auth.js';
import messageRoutes from './routes/message.js';

app.use(cors());
app.use(express.json());

// endpoints
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

const PORT: number = Number(process.env['PORT']) || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
