import express from 'express';
import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

const router = express.Router();

router.get('/api', (_req: Request, res:Response)=>{
  res.send('<h1>this is the main root for the server</h1>');
})

export default router;