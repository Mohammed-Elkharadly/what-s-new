import express from 'express';
import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

const router = express.Router();

router.get(
  '/signup',
  asyncHandler((_req: Request, res: Response) => {
    res.send('signup');
  }),
);
router.get(
  '/login',
  asyncHandler((_req: Request, res: Response) => {
    res.send('login');
  }),
);
router.get(
  '/logout',
  asyncHandler((_req: Request, res: Response) => {
    res.send('logout');
  }),
);

export default router;
