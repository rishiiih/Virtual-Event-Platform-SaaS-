import Event from '../models/Event.js';
import { validationResult } from 'express-validator';

/**
 * @route   POST /api/events
 * @desc    Create a new event (organizers only)
 * @access  Private
 */
export const createEvent = async (req, res) => {
  try {
    // Check if user is organizer
    if (req.user.role !== 'organizer' && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Only organizers can create events'
      });
    }

    const eventData = {
      ...req.body,
      organizer: req.user._id
    };

    const event = await Event.create(eventData);

    res.status(201).json({
      status: 'success',
      message: 'Event created successfully',
      data: { event }
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create event',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/events
 * @desc    Get all events with filters and pagination
 * @access  Public
 */
export const getEvents = async (req, res) => {
  try {
    const {
      status,
      category,
      eventType,
      search,
      page = 1,
      limit = 10,
      sort = '-startDate'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (eventType) filter.eventType = eventType;

    // Add search functionality
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const events = await Event.find(filter)
      .populate('organizer', 'name email avatar')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count
    const total = await Event.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      data: {
        events,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch events',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/events/:id
 * @desc    Get single event by ID
 * @access  Public
 */
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email avatar role');

    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { event }
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch event',
      error: error.message
    });
  }
};

/**
 * @route   PUT /api/events/:id
 * @desc    Update event (owner only)
 * @access  Private
 */
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }

    // Check if user is the event organizer or admin
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'You can only update your own events'
      });
    }

    // Update event
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('organizer', 'name email avatar');

    res.status(200).json({
      status: 'success',
      message: 'Event updated successfully',
      data: { event: updatedEvent }
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update event',
      error: error.message
    });
  }
};

/**
 * @route   DELETE /api/events/:id
 * @desc    Delete event (owner only)
 * @access  Private
 */
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }

    // Check if user is the event organizer or admin
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'You can only delete your own events'
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete event',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/events/my/organized
 * @desc    Get organizer's created events
 * @access  Private
 */
export const getMyEvents = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    // Build filter
    const filter = { organizer: req.user._id };
    if (status) filter.status = status;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get events
    const events = await Event.find(filter)
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count
    const total = await Event.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      data: {
        events,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get my events error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch events',
      error: error.message
    });
  }
};

/**
 * @route   PATCH /api/events/:id/status
 * @desc    Update event status (owner only)
 * @access  Private
 */
export const updateEventStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['draft', 'published', 'ongoing', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Valid status required (draft, published, ongoing, completed, cancelled)'
      });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }

    // Check if user is the event organizer or admin
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'You can only update your own events'
      });
    }

    event.status = status;
    await event.save();

    res.status(200).json({
      status: 'success',
      message: 'Event status updated successfully',
      data: { event }
    });
  } catch (error) {
    console.error('Update event status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update event status',
      error: error.message
    });
  }
};
