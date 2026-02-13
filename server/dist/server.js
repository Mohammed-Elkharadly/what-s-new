import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import messageRoutes from './routes/message.js';
import rootRoutes from './routes/root.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const app = express();
// 2. Define __dirname correctly for ESM (replacing path.resolve)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(cors());
app.use(express.json());
// Endpoints
app.use('/', rootRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
// Serve static files from Vite build
app.use(express.static(path.join(__dirname, '..', '..', 'client', 'dist')));
// SPA fallback — send index.html for all non-API routes
app.get('/{*any}', (_req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'dist', 'index.html'));
});
const PORT = Number(process.env['PORT']) || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map