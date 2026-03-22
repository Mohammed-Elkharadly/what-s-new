import express from 'express';
import asyncHandler from 'express-async-handler';
import { loginLimiter } from '../middleware/loginLimiter.js';
import { authenticated } from '../middleware/verifyJWT.js';
import {
  signup,
  login,
  logout,
  checkAuth,
  updateProfile,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', asyncHandler(signup));
router.post('/login', loginLimiter, asyncHandler(login));
router.post('/logout', asyncHandler(logout));

router.use(authenticated);

router.get('/check-auth', asyncHandler(checkAuth));
router.patch('/update-profile', asyncHandler(updateProfile));

export default router;
