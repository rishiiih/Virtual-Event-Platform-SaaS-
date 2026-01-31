# 🎯 Virtual Event Platform (SaaS)

A comprehensive full-stack web application for creating, managing, and hosting virtual events with real-time chat capabilities. Built with modern technologies and best practices, this platform serves as a complete solution for event organizers and attendees.

![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🌟 Live Demo

🌐 **Live Application**: https://virtual-event-platform-saa-s.vercel.app/

---

## ✨ Features Implemented

### 👤 User Authentication & Profile Management
- ✅ **JWT-based Authentication**: Secure registration, login, and logout functionality
- ✅ **User Profiles**: Complete profile management with personal information
- ✅ **Avatar Upload**: Cloudinary integration for profile picture storage
- ✅ **Password Management**: Change password with current password verification
- ✅ **Role Management**: User and Organizer role system with role upgrade functionality
- ✅ **Settings Page**: Comprehensive settings with account management

### 📅 Event Management System
- ✅ **Browse Events**: View all available events with rich details
- ✅ **Advanced Search**: Search events by name with debouncing for performance
- ✅ **Smart Filters**: Filter by date, category (tech/business/health/education), and event type (online/in-person)
- ✅ **Event Details**: Comprehensive event detail pages with location, capacity, and organizer info
- ✅ **Registration System**: Users can register for events with status tracking
- ✅ **My Registrations**: View and manage all event registrations in one place
- ✅ **Status Tracking**: Monitor registration status (pending, confirmed, cancelled, attended)

### 🏢 Organizer Dashboard & Features
- ✅ **Create Events**: Rich event creation form with validation
  - Event details (title, description, category)
  - Date and time scheduling
  - Location (online with meeting link or in-person with venue)
  - Capacity management (max attendees)
  - Event type selection
- ✅ **Edit Events**: Update existing events with pre-filled forms
- ✅ **Organizer Dashboard**: 
  - View all created events
  - Filter by status (upcoming, ongoing, completed, cancelled)
  - Quick actions (edit, delete, cancel)
  - Attendee count display
- ✅ **Event Management**: Full CRUD operations for organizers
- ✅ **Attendee Management**: View list of registered attendees for each event

### 💬 Real-time Chat System (Socket.io)
- ✅ **Event-based Chat Rooms**: Dedicated chat for each event
- ✅ **Real-time Messaging**: Instant message delivery using WebSocket
- ✅ **Message History**: Paginated message loading with MongoDB persistence
- ✅ **User Presence**: Live online users count for each event
- ✅ **Typing Indicators**: See when other users are typing
- ✅ **User Avatars**: Display profile pictures in chat
- ✅ **Message Actions**: Delete own messages (soft delete)
- ✅ **Organizer Privileges**: Event organizers can delete any message
- ✅ **Auto-scroll**: Smooth scrolling to latest messages
- ✅ **Character Limit**: 1000 character validation for messages

### 🎨 UI/UX Design
- ✅ **Custom Color Palette**: Dark-themed with purple-pink gradient accents
  - Primary Dark: `#1A1423`
  - Secondary: `#372549`
  - Accent: `#774C60`
  - Primary Accent: `#B75D69`
  - Light: `#EACDC2`
- ✅ **Responsive Design**: Mobile-first approach, works on all devices
- ✅ **Navigation**: Clean navbar with dropdown menu for better UX
- ✅ **Toast Notifications**: User feedback for all actions
- ✅ **Loading States**: Skeleton screens and loading indicators
- ✅ **Gradient Cards**: Beautiful event cards with hover effects
- ✅ **Form Validation**: Client-side validation with error messages

---

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2.0 | UI library for building user interfaces |
| **Vite** | 5.0.8 | Modern build tool and dev server |
| **React Router DOM** | 6.21.1 | Client-side routing and navigation |
| **Socket.io Client** | 4.8.3 | Real-time WebSocket client |
| **Axios** | 1.6.5 | HTTP client for API requests |
| **Tailwind CSS** | 3.4.1 | Utility-first CSS framework |
| **React Icons** | 5.0.1 | Icon library |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | JavaScript runtime environment |
| **Express.js** | 4.18.2 | Web application framework |
| **MongoDB** | Atlas | NoSQL database |
| **Mongoose** | 8.1.0 | MongoDB ODM |
| **Socket.io** | 4.8.3 | Real-time bidirectional communication |
| **JWT** | 9.0.2 | JSON Web Token authentication |
| **Bcrypt** | 5.1.1 | Password hashing |
| **Multer** | 1.4.5-lts.1 | File upload middleware |
| **Cloudinary** | 2.0.1 | Cloud image storage and management |
| **CORS** | 2.8.5 | Cross-Origin Resource Sharing |
| **Dotenv** | 16.3.1 | Environment variable management |

### Database Schema
- **User Model**: Authentication, profile, role, avatar
- **Event Model**: Comprehensive event details with nested location object
- **Registration Model**: User-event relationship with status tracking
- **Message Model**: Chat messages with soft delete and read tracking

### DevOps & Cloud Services
- **MongoDB Atlas**: Cloud database hosting
- **Cloudinary**: Image storage and CDN
- **Vercel**: Frontend hosting (planned)
- **Render**: Backend hosting (planned)
- **Git/GitHub**: Version control

---

## 📁 Project Architecture

```
Virtual-Event-Platform(SaaS)/
├── backend/                          # Node.js Express Server
│   ├── src/
│   │   ├── config/
│   │   │   ├── cloudinary.js        # Cloudinary SDK configuration
│   │   │   ├── database.js          # MongoDB connection setup
│   │   │   └── socket.js            # Socket.io server initialization
│   │   ├── controllers/
│   │   │   ├── authController.js    # Authentication logic
│   │   │   ├── eventController.js   # Event CRUD operations
│   │   │   ├── registrationController.js  # Registration management
│   │   │   └── chatController.js    # Chat message handling
│   │   ├── middleware/
│   │   │   ├── authenticate.js      # JWT token verification
│   │   │   └── upload.js            # Multer file upload config
│   │   ├── models/
│   │   │   ├── User.js              # User schema (auth, profile, role)
│   │   │   ├── Event.js             # Event schema with nested location
│   │   │   ├── Registration.js      # Event registration schema
│   │   │   └── Message.js           # Chat message schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js        # Authentication endpoints
│   │   │   ├── eventRoutes.js       # Event management endpoints
│   │   │   ├── registrationRoutes.js # Registration endpoints
│   │   │   └── chatRoutes.js        # Chat API endpoints
│   │   ├── utils/
│   │   │   └── jwt.js               # JWT token generation/verification
│   │   └── server.js                # Express app entry point
│   ├── .env                         # Environment variables (local)
│   ├── .env.production.example      # Production env template
│   └── package.json
│
├── frontend/                        # React Vite Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Navigation with user dropdown
│   │   │   ├── EventCard.jsx        # Event display component
│   │   │   ├── ChatRoom.jsx         # Real-time chat UI
│   │   │   └── Toast.jsx            # Notification component
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Authentication state management
│   │   │   ├── ToastContext.jsx     # Toast notification system
│   │   │   └── SocketContext.jsx    # Socket.io connection management
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx        # User login
│   │   │   ├── RegisterPage.jsx     # User registration
│   │   │   ├── ProfilePage.jsx      # User profile management
│   │   │   ├── SettingsPage.jsx     # Account settings
│   │   │   ├── EventsPage.jsx       # Browse all events
│   │   │   ├── EventDetailPage.jsx  # Single event details
│   │   │   ├── MyRegistrationsPage.jsx # User's registrations
│   │   │   ├── CreateEventPage.jsx  # Create new event (organizer)
│   │   │   ├── EditEventPage.jsx    # Edit event (organizer)
│   │   │   └── OrganizerDashboard.jsx # Organizer event management
│   │   ├── utils/
│   │   │   └── api.js               # Axios instance with interceptors
│   │   ├── App.jsx                  # Root component with routing
│   │   ├── main.jsx                 # Application entry point
│   │   └── index.css                # Global styles and Tailwind
│   ├── .env                         # Local environment variables
│   ├── .env.production.example      # Production env template
│   ├── vite.config.js               # Vite configuration
│   └── package.json
│
├── DEPLOYMENT_GUIDE.md              # Comprehensive deployment instructions
├── CHAT_SETUP.md                    # Socket.io setup guide
├── SOCKET_FIX.md                    # Troubleshooting guide
└── README.md                        # This file
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or higher
- **MongoDB Atlas** account (free tier works)
- **Cloudinary** account for image storage
- **Git** for version control

### Installation Steps

#### 1. Clone the Repository
```bash
git clone https://github.com/rishiiih/Virtual-Event-Platform-SaaS-.git
cd Virtual-Event-Platform-SaaS-
```

#### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in `backend/` directory:
```env
NODE_ENV=development
PORT=5000

# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/virtualeventplatform

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRE=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173
```

Start backend server:
```bash
npm run dev
```
✅ Backend runs on: `http://localhost:5000`

#### 3. Frontend Setup

Open new terminal:
```bash
cd frontend
npm install
```

Create `.env` file in `frontend/` directory:
```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api

# Socket.io Server URL
VITE_SOCKET_URL=http://localhost:5000
```

Start frontend dev server:
```bash
npm run dev
```
✅ Frontend runs on: `http://localhost:5173`

#### 4. Access the Application

1. Open browser and navigate to `http://localhost:5173`
2. Register a new account
3. Upload your avatar
4. Explore events or become an organizer
5. Create events and chat in real-time!

---

## 📚 API Endpoints

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | ❌ |
| POST | `/login` | Login user | ❌ |
| GET | `/me` | Get current user profile | ✅ |
| PUT | `/profile` | Update user profile | ✅ |
| POST | `/avatar` | Upload profile picture | ✅ |
| PUT | `/password` | Change password | ✅ |
| PUT | `/role` | Update user role (become organizer) | ✅ |

### Event Routes (`/api/events`)
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/` | Get all events (with filters) | ❌ | - |
| GET | `/:id` | Get single event details | ❌ | - |
| POST | `/` | Create new event | ✅ | Organizer |
| PUT | `/:id` | Update event | ✅ | Organizer (owner) |
| DELETE | `/:id` | Delete event | ✅ | Organizer (owner) |
| GET | `/my-events` | Get organizer's events | ✅ | Organizer |
| PATCH | `/:id/cancel` | Cancel event | ✅ | Organizer (owner) |
| GET | `/:id/attendees` | Get event attendees | ✅ | Organizer (owner) |

### Registration Routes (`/api/registrations`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register for event | ✅ |
| GET | `/my-registrations` | Get user's registrations | ✅ |
| GET | `/event/:eventId` | Get event registrations | ✅ |
| PATCH | `/:id/status` | Update registration status | ✅ |

### Chat Routes (`/api/chat`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/:eventId/messages` | Get message history | ✅ |
| POST | `/:eventId/messages` | Send message | ✅ |
| DELETE | `/messages/:messageId` | Delete message | ✅ |

### Socket.io Events

**Client to Server:**
- `join:event` - Join event chat room
- `leave:event` - Leave event chat room
- `message:send` - Send chat message
- `typing:start` - Start typing indicator
- `typing:stop` - Stop typing indicator

**Server to Client:**
- `message:received` - New message broadcast
- `users:update` - Online users count update
- `user:typing` - User typing notification
- `message:deleted` - Message deleted notification

---

## 🎨 Design System

### Color Palette
```css
:root {
  --primary-dark: #1A1423;    /* Deep purple-black for backgrounds */
  --secondary: #372549;       /* Dark purple for cards/containers */
  --accent: #774C60;          /* Muted purple-pink for highlights */
  --primary-accent: #B75D69;  /* Rose for primary buttons */
  --light: #EACDC2;           /* Beige-pink for text on dark */
}
```

### Typography
- **Headings**: System font stack with bold weights
- **Body**: Inter, system-ui fallback
- **Code**: Monospace for technical content

### Components
- Gradient buttons with hover effects
- Shadow-elevated cards
- Smooth transitions (200ms ease)
- Consistent spacing system (Tailwind)

---

## 📋 Development Roadmap

### ✅ Phase 1: Authentication & Profile (Completed)
- [x] User registration with validation
- [x] Login with JWT tokens
- [x] Profile management
- [x] Avatar upload to Cloudinary
- [x] Password change functionality
- [x] Role-based access (User/Organizer)

### ✅ Phase 2: Event Management (Completed)
- [x] Event CRUD operations
- [x] Browse events with search and filters
- [x] Event detail pages
- [x] Registration system
- [x] Organizer dashboard
- [x] My registrations page

### ✅ Phase 3: Real-time Chat (Completed)
- [x] Socket.io integration
- [x] Event-based chat rooms
- [x] Message persistence
- [x] Typing indicators
- [x] Online users tracking
- [x] Message deletion

### 🔄 Phase 4: Deployment (In Progress)
- [x] Environment configuration
- [x] Production build setup
- [ ] Deploy backend to Render
- [ ] Deploy frontend to Vercel
- [ ] Configure production database
- [ ] SSL/HTTPS setup
- [ ] Performance optimization

### 📅 Phase 5: Advanced Features (Planned)
- [ ] **Payment Integration**: Stripe for paid events
- [ ] **Email Notifications**: SendGrid for event reminders
- [ ] **Event Analytics**: Dashboard for organizers
- [ ] **Live Streaming**: WebRTC or third-party integration
- [ ] **Calendar Integration**: Google Calendar, Outlook sync
- [ ] **Advanced Chat**: 
  - Message reactions (emoji)
  - File sharing
  - Message threads
  - @mentions
- [ ] **Search Enhancement**: Elasticsearch for better search
- [ ] **Recommendations**: AI-based event suggestions
- [ ] **Social Features**:
  - Follow organizers
  - Event sharing
  - User reviews/ratings
- [ ] **Multi-language**: i18n support
- [ ] **Theme Toggle**: Dark/Light mode
- [ ] **Mobile App**: React Native version

---

## 🔒 Environment Variables

### Backend Required Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` or `production` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT | Min 32 characters |
| `JWT_EXPIRE` | Token expiration | `7d` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Your cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Your API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Your API secret |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

### Frontend Required Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `VITE_SOCKET_URL` | Socket.io server URL | `http://localhost:5000` |

---

## 🚀 Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for comprehensive deployment instructions including:
- Backend deployment on Render
- Frontend deployment on Vercel
- MongoDB Atlas configuration
- Environment variables setup
- CORS configuration
- Troubleshooting tips
- Post-deployment testing

### Quick Deploy
1. Merge feature branch to main
2. Connect GitHub to Vercel (frontend)
3. Connect GitHub to Render (backend)
4. Configure environment variables
5. Deploy both services
6. Test live application

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Profile update and avatar upload
- [ ] Password change
- [ ] Role upgrade to organizer
- [ ] Create event with all fields
- [ ] Edit existing event
- [ ] Delete/cancel event
- [ ] Browse and filter events
- [ ] Register for event
- [ ] View registrations
- [ ] Join event chat room
- [ ] Send/receive messages in real-time
- [ ] Typing indicators
- [ ] Delete messages
- [ ] Online users count

---

## 🐛 Known Issues & Solutions

### Socket.io Connection Issues
**Problem**: "Invalid namespace" error  
**Solution**: Restart backend server after Socket.io code changes  
**Reference**: See [SOCKET_FIX.md](SOCKET_FIX.md)

### JWT Authentication
**Problem**: "User not found" on socket connection  
**Solution**: Ensure JWT payload uses `id` field, not `userId`  
**Fixed**: ✅ Resolved in feature/realtime-chat branch

### Free Tier Limitations
**Note**: Render free tier sleeps after 15 minutes of inactivity  
**Impact**: First request takes 30-60 seconds to wake up  
**Solution**: Acceptable for portfolio/resume projects

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Rishi**
- GitHub: [@rishiiih](https://github.com/rishiiih)
- Portfolio: [Coming Soon]
- LinkedIn: [Your LinkedIn]

---

## 🙏 Acknowledgments

- **MongoDB Atlas** for reliable cloud database hosting
- **Cloudinary** for seamless media management
- **Socket.io** for real-time communication capabilities
- **Vercel** and **Render** for excellent deployment platforms
- **React** and **Node.js** communities for extensive documentation
- **Tailwind CSS** for rapid UI development

---

## 📊 Project Statistics

- **Total Development Time**: Multiple phases over several weeks
- **Lines of Code**: ~15,000+ (Backend + Frontend)
- **Components**: 20+ React components
- **API Endpoints**: 25+ RESTful routes
- **Database Models**: 4 main schemas
- **Real-time Events**: 10+ Socket.io events
- **Dependencies**: 30+ npm packages

---

## 🎯 Project Goals

This project was built to demonstrate:
1. ✅ Full-stack development proficiency (MERN)
2. ✅ Real-time features implementation (WebSocket/Socket.io)
3. ✅ Authentication and authorization (JWT, role-based)
4. ✅ RESTful API design principles
5. ✅ Database modeling and relationships
6. ✅ Cloud services integration (MongoDB Atlas, Cloudinary)
7. ✅ Modern frontend development (React Hooks, Context API)
8. ✅ Responsive UI/UX design
9. 🔄 DevOps and deployment (In Progress)
10. 📅 Scalable architecture (Planned enhancements)

---

⭐ **If you find this project helpful, please consider giving it a star!** ⭐
