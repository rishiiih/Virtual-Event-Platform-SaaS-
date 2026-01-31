import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Message from '../models/Message.js';
import User from '../models/User.js';

// Store active users per event
const activeUsers = new Map(); // eventId -> Set of user objects

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true
    }
  });

  // Authentication middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // JWT payload uses 'id' not 'userId'
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      console.error('Socket auth error:', error);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.user.name} (${socket.userId})`);

    // Join event room
    socket.on('join:event', (eventId) => {
      socket.join(`event:${eventId}`);
      
      // Add user to active users
      if (!activeUsers.has(eventId)) {
        activeUsers.set(eventId, new Set());
      }
      
      const eventUsers = activeUsers.get(eventId);
      eventUsers.add({
        id: socket.userId,
        name: socket.user.name,
        avatar: socket.user.avatar,
        role: socket.user.role
      });

      // Broadcast updated user list
      io.to(`event:${eventId}`).emit('users:update', Array.from(eventUsers));

      console.log(`👤 ${socket.user.name} joined event: ${eventId}`);
    });

    // Leave event room
    socket.on('leave:event', (eventId) => {
      socket.leave(`event:${eventId}`);
      
      // Remove user from active users
      const eventUsers = activeUsers.get(eventId);
      if (eventUsers) {
        eventUsers.forEach(user => {
          if (user.id === socket.userId) {
            eventUsers.delete(user);
          }
        });

        // Broadcast updated user list
        io.to(`event:${eventId}`).emit('users:update', Array.from(eventUsers));
      }

      console.log(`👋 ${socket.user.name} left event: ${eventId}`);
    });

    // Send message
    socket.on('message:send', async (data) => {
      try {
        const { eventId, content } = data;

        if (!content || content.trim().length === 0) {
          return;
        }

        // Save message to database
        const message = await Message.create({
          event: eventId,
          sender: socket.userId,
          content: content.trim(),
          type: 'text'
        });

        await message.populate('sender', 'name avatar role');

        // Broadcast message to all users in the event room
        io.to(`event:${eventId}`).emit('message:received', {
          _id: message._id,
          event: message.event,
          sender: message.sender,
          content: message.content,
          type: message.type,
          createdAt: message.createdAt
        });

        console.log(`💬 Message in event ${eventId}: ${socket.user.name}: ${content}`);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('message:error', { message: 'Failed to send message' });
      }
    });

    // Typing indicator
    socket.on('typing:start', (eventId) => {
      socket.to(`event:${eventId}`).emit('user:typing', {
        userId: socket.userId,
        name: socket.user.name
      });
    });

    socket.on('typing:stop', (eventId) => {
      socket.to(`event:${eventId}`).emit('user:stopped-typing', {
        userId: socket.userId
      });
    });

    // Delete message
    socket.on('message:delete', async (data) => {
      try {
        const { eventId, messageId } = data;

        const message = await Message.findById(messageId);
        
        if (!message) {
          return socket.emit('message:error', { message: 'Message not found' });
        }

        // Check if user is sender
        if (message.sender.toString() !== socket.userId) {
          return socket.emit('message:error', { message: 'Not authorized' });
        }

        message.isDeleted = true;
        await message.save();

        // Broadcast deletion
        io.to(`event:${eventId}`).emit('message:deleted', { messageId });
      } catch (error) {
        console.error('Error deleting message:', error);
        socket.emit('message:error', { message: 'Failed to delete message' });
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      // Remove user from all active rooms
      activeUsers.forEach((eventUsers, eventId) => {
        eventUsers.forEach(user => {
          if (user.id === socket.userId) {
            eventUsers.delete(user);
            
            // Broadcast updated user list
            io.to(`event:${eventId}`).emit('users:update', Array.from(eventUsers));
          }
        });
      });

      console.log(`❌ User disconnected: ${socket.user.name}`);
    });
  });

  return io;
};
