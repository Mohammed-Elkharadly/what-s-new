import express from 'express';
import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

const router = express.Router();

router.get(
  '/send',
  asyncHandler((_req: Request, res: Response) => {
    res.send('send a message');
  }),
);

export default router;