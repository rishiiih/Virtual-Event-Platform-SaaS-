# Real-time Chat Feature Setup

## Installation Steps

### 1. Install Backend Dependencies
```bash
cd backend
npm install socket.io
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install socket.io-client
```

### 3. Update Environment Variables (Optional)
Add to `backend/.env` if not already present:
```
FRONTEND_URL=http://localhost:5173
```

### 4. Restart Servers
```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

## Features Implemented

### Backend
- ✅ Message model with soft delete
- ✅ Chat controller (get messages, send, delete)
- ✅ Socket.io server integration
- ✅ Real-time message broadcasting
- ✅ Online users tracking
- ✅ Typing indicators
- ✅ System messages (user joined/left)
- ✅ JWT authentication for socket connections
- ✅ Event-based chat rooms

### Frontend
- ✅ SocketContext for managing connections
- ✅ ChatRoom component with modern UI
- ✅ Real-time message sending/receiving
- ✅ Online users display
- ✅ Typing indicators
- ✅ Message history loading
- ✅ Auto-scroll to latest message
- ✅ User avatars in chat
- ✅ Integrated with EventDetailPage (only visible to registered users)

## How to Use

1. **Register/Login** to your account
2. **Navigate to an event** detail page
3. **Register for the event** if not already registered
4. **Chat section** will appear at the bottom of the event page
5. **Send messages** in real-time with other registered attendees
6. **See who's online** and typing indicators

## Chat Features
- Real-time messaging
- User presence (online/offline)
- Typing indicators
- Message history
- System notifications (user joined/left)
- Auto-scroll to new messages
- Character limit (1000 chars)
- Modern gradient UI matching the app theme

## Notes
- Chat is only available to **registered attendees**
- Chat rooms are **per event**
- Messages are **persisted** in MongoDB
- Socket connections use **JWT authentication**
- **CORS** is configured for localhost development
