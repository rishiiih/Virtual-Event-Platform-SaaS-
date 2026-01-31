import Message from '../models/Message.js';
import Event from '../models/Event.js';

/**
 * @route   GET /api/chat/:eventId/messages
 * @desc    Get messages for an event
 * @access  Private
 */
export const getEventMessages = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }

    const skip = (page - 1) * limit;

    // Get messages
    const messages = await Message.find({ 
      event: eventId,
      isDeleted: false 
    })
      .populate('sender', 'name avatar role')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    // Count total messages
    const total = await Message.countDocuments({ 
      event: eventId,
      isDeleted: false 
    });

    res.status(200).json({
      status: 'success',
      data: {
        messages: messages.reverse(), // Oldest first
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch messages',
      error: error.message
    });
  }
};

/**
 * @route   POST /api/chat/:eventId/messages
 * @desc    Send a message
 * @access  Private
 */
export const sendMessage = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { content, type = 'text' } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Message content is required'
      });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }

    // Create message
    const message = await Message.create({
      event: eventId,
      sender: req.user._id,
      content: content.trim(),
      type
    });

    // Populate sender info
    await message.populate('sender', 'name avatar role');

    res.status(201).json({
      status: 'success',
      data: { message }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to send message',
      error: error.message
    });
  }
};

/**
 * @route   DELETE /api/chat/messages/:messageId
 * @desc    Delete a message
 * @access  Private
 */
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        status: 'error',
        message: 'Message not found'
      });
    }

    // Check if user is the sender or event organizer
    const event = await Event.findById(message.event);
    const isOrganizer = event.organizer.toString() === req.user._id.toString();
    const isSender = message.sender.toString() === req.user._id.toString();

    if (!isOrganizer && !isSender) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this message'
      });
    }

    // Soft delete
    message.isDeleted = true;
    await message.save();

    res.status(200).json({
      status: 'success',
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete message',
      error: error.message
    });
  }
};
