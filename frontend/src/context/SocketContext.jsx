import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    if (!token || !isAuthenticated) {
      // Disconnect if no token
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setConnected(false);
      }
      return;
    }

    // Initialize socket connection with environment-based URL
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const newSocket = io(SOCKET_URL, {
      auth: {
        token
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated]);

  const joinEventRoom = (eventId) => {
    if (socket && connected) {
      socket.emit('join:event', eventId);
    }
  };

  const leaveEventRoom = (eventId) => {
    if (socket && connected) {
      socket.emit('leave:event', eventId);
    }
  };

  const sendMessage = (eventId, content) => {
    if (socket && connected) {
      socket.emit('message:send', { eventId, content });
    }
  };

  const deleteMessage = (eventId, messageId) => {
    if (socket && connected) {
      socket.emit('message:delete', { eventId, messageId });
    }
  };

  const startTyping = (eventId) => {
    if (socket && connected) {
      socket.emit('typing:start', eventId);
    }
  };

  const stopTyping = (eventId) => {
    if (socket && connected) {
      socket.emit('typing:stop', eventId);
    }
  };

  const value = {
    socket,
    connected,
    joinEventRoom,
    leaveEventRoom,
    sendMessage,
    deleteMessage,
    startTyping,
    stopTyping
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
