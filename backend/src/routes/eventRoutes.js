import express from 'express';
import { body } from 'express-validator';
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getMyEvents,
  updateEventStatus
} from '../controllers/eventController.js';
import {
  registerForEvent,
  unregisterFromEvent,
  getEventRegistrations
} from '../controllers/registrationController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Validation rules for creating event
const createEventValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Description must be between 10 and 5000 characters'),
  body('eventType')
    .optional()
    .isIn(['conference', 'workshop', 'webinar', 'meetup', 'seminar', 'other'])
    .withMessage('Invalid event type'),
  body('category')
    .optional()
    .isIn(['technology', 'business', 'education', 'health', 'entertainment', 'other'])
    .withMessage('Invalid category'),
  body('startDate')
    .isISO8601()
    .withMessage('Valid start date is required'),
  body('endDate')
    .isISO8601()
    .withMessage('Valid end date is required'),
  body('maxAttendees')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Max attendees must be a positive number'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be 0 or greater')
];

// Public routes
router.get('/', getEvents);

// Protected routes (organizers only) - MUST come before /:id route
router.get('/my/organized', authenticate, getMyEvents);

// Public route - must come after specific routes
router.get('/:id', getEventById);

// More protected routes
router.post('/', authenticate, createEventValidation, validate, createEvent);
router.put('/:id', authenticate, updateEvent);
router.patch('/:id/status', authenticate, updateEventStatus);
router.delete('/:id', authenticate, deleteEvent);

// Registration routes
router.post('/:id/register', authenticate, registerForEvent);
router.delete('/:id/register', authenticate, unregisterFromEvent);
router.get('/:id/registrations', authenticate, getEventRegistrations);

export default router;
