import Registration from '../models/Registration.js';
import Event from '../models/Event.js';
import { sendCancellationEmail } from '../services/emailService.js';

/**
 * @route   POST /api/events/:id/register
 * @desc    Register for an event
 * @access  Private
 */
export const registerForEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }

    // Check if event is published
    if (event.status !== 'published') {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot register for unpublished events'
      });
    }

    // Check if event is full
    if (event.isFull) {
      return res.status(400).json({
        status: 'error',
        message: 'Event is full'
      });
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({
      event: eventId,
      attendee: userId,
      status: 'registered'
    });

    if (existingRegistration) {
      return res.status(400).json({
        status: 'error',
        message: 'You are already registered for this event'
      });
    }

    // Determine payment status
    const paymentStatus = event.price > 0 ? 'pending' : 'free';

    // Create registration
    const registration = await Registration.create({
      event: eventId,
      attendee: userId,
      paymentStatus,
      paymentAmount: event.price
    });

    // Increment current attendees count
    await Event.findByIdAndUpdate(eventId, {
      $inc: { currentAttendees: 1 }
    });

    // Populate registration data
    const populatedRegistration = await Registration.findById(registration._id)
      .populate('event', 'title startDate endDate location')
      .populate('attendee', 'name email');

    res.status(201).json({
      status: 'success',
      message: 'Successfully registered for event',
      data: { registration: populatedRegistration }
    });
  } catch (error) {
    console.error('Register for event error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'You are already registered for this event'
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Failed to register for event',
      error: error.message
    });
  }
};

/**
 * @route   DELETE /api/events/:id/register
 * @desc    Unregister from an event
 * @access  Private
 */
export const unregisterFromEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;

    // Find active registration
    const registration = await Registration.findOne({
      event: eventId,
      attendee: userId,
      status: 'registered'
    }).populate('attendee', 'name email');

    if (!registration) {
      return res.status(404).json({
        status: 'error',
        message: 'Registration not found'
      });
    }

    // Get event details for email
    const event = await Event.findById(eventId);

    // Update registration status to cancelled
    registration.status = 'cancelled';
    await registration.save();

    // Decrement current attendees count
    await Event.findByIdAndUpdate(eventId, {
      $inc: { currentAttendees: -1 }
    });

    // Send cancellation email
    try {
      await sendCancellationEmail(registration.attendee, event);
    } catch (emailError) {
      console.error('Failed to send cancellation email:', emailError);
    }

    res.status(200).json({
      status: 'success',
      message: 'Successfully unregistered from event'
    });
  } catch (error) {
    console.error('Unregister from event error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to unregister from event',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/registrations/my-events
 * @desc    Get user's registered events
 * @access  Private
 */
export const getMyRegistrations = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status = 'registered' } = req.query;

    const filter = { attendee: userId };
    if (status) {
      filter.status = status;
    }

    const registrations = await Registration.find(filter)
      .populate('event')
      .sort('-registeredAt');

    res.status(200).json({
      status: 'success',
      data: {
        registrations,
        count: registrations.length
      }
    });
  } catch (error) {
    console.error('Get my registrations error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch registrations',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/events/:id/registrations
 * @desc    Get registrations for an event (organizer only)
 * @access  Private
 */
export const getEventRegistrations = async (req, res) => {
  try {
    const eventId = req.params.id;

    // Check if event exists and user is the organizer
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }

    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Only the event organizer can view registrations'
      });
    }

    const { status } = req.query;
    const filter = { event: eventId };
    if (status) {
      filter.status = status;
    }

    const registrations = await Registration.find(filter)
      .populate('attendee', 'name email avatar')
      .sort('-registeredAt');

    res.status(200).json({
      status: 'success',
      data: {
        registrations,
        count: registrations.length
      }
    });
  } catch (error) {
    console.error('Get event registrations error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch event registrations',
      error: error.message
    });
  }
};
