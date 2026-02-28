import express from 'express';
import { authenticated } from '../middleware/verifyJWT.js'
import asyncHandler from 'express-async-handler';
import {
  getAllContacts,
  getAllChats,
  getMessageByUserId,
  sendMessage,
} from '../controllers/messageController.js';
const router = express.Router();

router.use(authenticated);

router.get('/contacts', asyncHandler(getAllContacts));
router.get('/chats', asyncHandler(getAllChats));
router.get('/:id', asyncHandler(getMessageByUserId));
router.post('/send/:id', asyncHandler(sendMessage));
export default router;
