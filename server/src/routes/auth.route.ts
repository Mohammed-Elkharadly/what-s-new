import express from 'express';
import asyncHandler from 'express-async-handler';
import { loginLimiter } from '../middleware/loginLimiter.js';
import { authenticated } from '../middleware/verifyJWT.js';
import type { Request, Response } from 'express';
import {
  signup,
  login,
  logout,
  updateProfile,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', asyncHandler(signup));
router.post('/login', loginLimiter, asyncHandler(login));
router.post('/logout', asyncHandler(logout));

router.use(authenticated);

router.patch('/update-profile', asyncHandler(updateProfile));


export default router;
