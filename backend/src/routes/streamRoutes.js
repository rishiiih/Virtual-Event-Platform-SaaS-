import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { 
  startStream, 
  stopStream, 
  joinStream, 
  getStreamStatus 
} from '../controllers/streamController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/stream/:eventId/start
 * @desc    Start live stream for an event (Organizer only)
 * @access  Private (Organizer)
 */
router.post('/:eventId/start', startStream);

/**
 * @route   POST /api/stream/:eventId/stop
 * @desc    Stop live stream for an event (Organizer only)
 * @access  Private (Organizer)
 */
router.post('/:eventId/stop', stopStream);

/**
 * @route   POST /api/stream/:eventId/join
 * @desc    Join live stream (Get access token)
 * @access  Private (Registered users)
 */
router.post('/:eventId/join', joinStream);

/**
 * @route   GET /api/stream/:eventId/status
 * @desc    Get stream status for an event
 * @access  Private
 */
router.get('/:eventId/status', getStreamStatus);

export default router;
