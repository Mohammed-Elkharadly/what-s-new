import express from 'express';
import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

const router = express.Router();

router.post('/send', (_req: Request, res: Response) => {
  res.send('send a message');
});
export default router;
