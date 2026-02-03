import Event from '../models/Event.js';
import { generateAgoraToken, createChannelName } from '../config/agora.js';

/**
 * Start live stream for an event (Organizer only)
 */
export const startStream = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    // Find event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is the organizer
    if (event.organizer.toString() !== userId) {
      return res.status(403).json({ message: 'Only the event organizer can start the stream' });
    }

    // Check if stream already exists and has valid channel
    if (event.stream.status === 'live' && event.stream.channelName) {
      // Generate new host token for existing stream
      const hostToken = generateAgoraToken(event.stream.channelName, 0, true);
      
      return res.status(200).json({
        message: 'Stream is already live',
        stream: {
          channelName: event.stream.channelName,
          token: hostToken,
          appId: process.env.AGORA_APP_ID,
          isLive: true
        }
      });
    }

    // Reset stream if it's in an invalid state (e.g., old Daily.co data)
    if (event.stream.status === 'live' && !event.stream.channelName) {
      console.log('⚠️  Resetting invalid stream state');
      event.stream.status = 'not-started';
      event.isLive = false;
      await event.save();
    }

    // Create channel name
    const channelName = createChannelName(event._id);

    // Generate host token (broadcaster role)
    const hostToken = generateAgoraToken(channelName, 0, true);

    // Update event with stream details
    event.stream = {
      channelName,
      status: 'live',
      startedAt: new Date(),
      endedAt: null
    };
    event.isLive = true;
    await event.save();

    console.log(`✅ Stream started for event: ${event.title}`);

    res.status(200).json({
      message: 'Stream started successfully',
      stream: {
        channelName,
        token: hostToken,
        appId: process.env.AGORA_APP_ID,
        isLive: true
      }
    });
  } catch (error) {
    console.error('❌ Error starting stream:', error);
    res.status(500).json({ message: 'Failed to start stream', error: error.message });
  }
};

/**
 * Stop live stream for an event (Organizer only)
 */
export const stopStream = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    // Find event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is the organizer
    if (event.organizer.toString() !== userId) {
      return res.status(403).json({ message: 'Only the event organizer can stop the stream' });
    }

    // Check if stream is live
    if (event.stream.status !== 'live') {
      return res.status(400).json({ message: 'Stream is not currently live' });
    }

    // Update event (no need to delete Agora channel, it auto-expires)
    event.stream.status = 'ended';
    event.stream.endedAt = new Date();
    event.isLive = false;
    await event.save();

    console.log(`✅ Stream stopped for event: ${event.title}`);

    res.json({
      message: 'Stream stopped successfully',
      stream: event.stream
    });
  } catch (error) {
    console.error('❌ Error stopping stream:', error);
    res.status(500).json({ message: 'Failed to stop stream', error: error.message });
  }
};

/**
 * Join live stream (Attendees - View Only)
 */
export const joinStream = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    // Find event
    const event = await Event.findById(eventId).populate('organizer', 'name email');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if stream is live
    if (event.stream.status !== 'live') {
      return res.status(400).json({ message: 'Stream is not currently live' });
    }

    // Check if user is the organizer
    const isOrganizer = event.organizer._id.toString() === userId;

    // Generate token: Host for organizer, Audience for viewers
    const token = generateAgoraToken(event.stream.channelName, 0, isOrganizer);

    res.json({
      message: 'Stream access granted',
      stream: {
        channelName: event.stream.channelName,
        token,
        appId: process.env.AGORA_APP_ID,
        status: event.stream.status,
        isOrganizer
      }
    });
  } catch (error) {
    console.error('❌ Error joining stream:', error);
    res.status(500).json({ message: 'Failed to join stream', error: error.message });
  }
};

/**
 * Get stream status for an event
 */
export const getStreamStatus = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId).select('stream isLive title');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({
      isLive: event.isLive,
      stream: event.stream
    });
  } catch (error) {
    console.error('❌ Error getting stream status:', error);
    res.status(500).json({ message: 'Failed to get stream status', error: error.message });
  }
};
