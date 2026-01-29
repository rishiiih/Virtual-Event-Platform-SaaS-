# Virtual Event Platform (SaaS)

A full-stack MERN platform for hosting virtual events with live streaming, real-time chat, and ticket management.

## 🏗️ Tech Stack

### Frontend
- React 18 (Vite)
- Tailwind CSS
- React Router
- Axios
- Socket.io Client

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Socket.io
- JWT Authentication
- Stripe (Payments)
- Cloudinary (File Storage)

## 📁 Project Structure

```
Virtual-Event-Platform/
├── backend/          # Express.js API server
│   ├── src/
│   │   ├── config/   # Database, Cloudinary config
│   │   ├── models/   # Mongoose schemas
│   │   ├── routes/   # API routes
│   │   ├── middleware/   # Auth, validation
│   │   ├── controllers/  # Business logic
│   │   └── server.js     # Entry point
│   └── package.json
├── frontend/         # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Cloudinary account
- Stripe account (test mode)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your credentials

5. Start development server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Start development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📋 Development Phases

- [x] **Phase 1**: Walking Skeleton (Auth, Profile)
- [ ] **Phase 2**: Event Management
- [ ] **Phase 3**: Payments & Tickets
- [ ] **Phase 4**: Live Streaming & Real-time
- [ ] **Phase 5**: Production Polish

## 🔑 Environment Variables

### Backend
See `backend/.env.example` for required variables

### Frontend
See `frontend/.env.example` for required variables

## 📝 License

MIT

## 👥 Author

Senior MERN Stack Architect
