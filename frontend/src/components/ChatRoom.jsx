import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';

const ChatRoom = ({ eventId }) => {
  const { socket, connected, joinEventRoom, leaveEventRoom, sendMessage, startTyping, stopTyping } = useSocket();
  const { user } = useAuth();
  const toast = useToast();
  
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState(new Set());
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Fetch message history
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/chat/${eventId}/messages`);
        setMessages(response.data.data.messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [eventId]);

  // Join event room and setup socket listeners
  useEffect(() => {
    if (!connected || !socket) return;

    joinEventRoom(eventId);

    // Listen for new messages
    socket.on('message:received', (message) => {
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    });

    // Listen for system messages
    socket.on('message:system', (data) => {
      const systemMessage = {
        type: 'system',
        content: data.content,
        createdAt: data.timestamp
      };
      setMessages(prev => [...prev, systemMessage]);
      scrollToBottom();
    });

    // Listen for online users updates
    socket.on('users:update', (users) => {
      setOnlineUsers(users);
    });

    // Listen for typing indicators
    socket.on('user:typing', (data) => {
      setTypingUsers(prev => new Set([...prev, data.name]));
    });

    socket.on('user:stopped-typing', (data) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        // Find and remove by userId
        onlineUsers.forEach(u => {
          if (u.id === data.userId) {
            newSet.delete(u.name);
          }
        });
        return newSet;
      });
    });

    // Listen for message deletion
    socket.on('message:deleted', (data) => {
      setMessages(prev => prev.filter(msg => msg._id !== data.messageId));
    });

    return () => {
      leaveEventRoom(eventId);
      socket.off('message:received');
      socket.off('message:system');
      socket.off('users:update');
      socket.off('user:typing');
      socket.off('user:stopped-typing');
      socket.off('message:deleted');
    };
  }, [connected, socket, eventId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);

    // Typing indicator
    if (connected) {
      startTyping(eventId);

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping(eventId);
      }, 2000);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!inputMessage.trim()) return;

    sendMessage(eventId, inputMessage.trim());
    setInputMessage('');
    
    // Stop typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    stopTyping(eventId);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!connected) {
    return (
      <div className="flex items-center justify-center h-full py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-accent border-t-transparent mb-4"></div>
          <p className="text-primary-dark/70">Connecting to chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-primary/10 shadow-subtle">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-primary to-accent p-4 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold text-lg">Event Chat</h3>
            <p className="text-white/80 text-sm">
              {onlineUsers.length} {onlineUsers.length === 1 ? 'person' : 'people'} online
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white text-sm">Live</span>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[500px]">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-accent border-t-transparent"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-primary-dark/60">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => (
            message.type === 'system' ? (
              <div key={index} className="text-center text-sm text-primary-dark/60 italic">
                {message.content}
              </div>
            ) : (
              <div
                key={message._id}
                className={`flex ${message.sender._id === user?._id ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[70%] ${message.sender._id === user?._id ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {message.sender.avatar ? (
                      <img
                        src={message.sender.avatar}
                        alt={message.sender.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {message.sender.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium text-primary-dark ${message.sender._id === user?._id ? 'text-right' : ''}`}>
                        {message.sender._id === user?._id ? 'You' : message.sender.name}
                      </span>
                      <span className="text-xs text-primary-dark/50">
                        {formatTime(message.createdAt)}
                      </span>
                    </div>
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        message.sender._id === user?._id
                          ? 'bg-accent text-white rounded-tr-none'
                          : 'bg-primary/10 text-primary-dark rounded-tl-none'
                      }`}
                    >
                      <p className="text-sm break-words">{message.content}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      {typingUsers.size > 0 && (
        <div className="px-4 py-2 text-sm text-primary-dark/60 italic">
          {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
        </div>
      )}

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-primary/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-accent transition-colors"
            maxLength={1000}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatRoom;
