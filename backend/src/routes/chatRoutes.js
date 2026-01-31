import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getEventMessages,
  sendMessage,
  deleteMessage
} from '../controllers/chatController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Chat routes
router.get('/:eventId/messages', getEventMessages);
router.post('/:eventId/messages', sendMessage);
router.delete('/messages/:messageId', deleteMessage);

export default router;
