import express from 'express';
import asyncHandler from 'express-async-handler';
import { loginLimiter } from '../middleware/loginLimiter.js';
import { signup, login, logout } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', asyncHandler(signup));
router.post('/login', loginLimiter, asyncHandler(login));
router.post('/logout', asyncHandler(logout));

export default router;
