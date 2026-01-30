import express from 'express';
import { getMyRegistrations } from '../controllers/registrationController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get user's registrations
router.get('/my-events', authenticate, getMyRegistrations);

export default router;
