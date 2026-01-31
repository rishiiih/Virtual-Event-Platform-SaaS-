# Deployment Guide - Virtual Event Platform

This guide will help you deploy the Virtual Event Platform to production for your resume/portfolio.

## Overview
- **Frontend**: React + Vite → Deploy to **Vercel** (Recommended)
- **Backend**: Node.js + Socket.io → Deploy to **Render** (Recommended)
- **Database**: MongoDB Atlas (Already configured ✅)
- **Storage**: Cloudinary (Already configured ✅)

---

## Prerequisites Checklist
- [x] MongoDB Atlas account with cluster running
- [x] Cloudinary account with API keys
- [ ] GitHub repository (you already have this)
- [ ] Vercel account (sign up at vercel.com with GitHub)
- [ ] Render account (sign up at render.com with GitHub)

---

## Part 1: Backend Deployment (Render)

### Step 1: Prepare Backend for Production

1. **Create production environment variables file reference**
   - You'll set these on Render dashboard
   - Required variables:
     ```
     NODE_ENV=production
     PORT=5000
     MONGODB_URI=<your-mongodb-atlas-uri>
     JWT_SECRET=<your-secret>
     CLOUDINARY_CLOUD_NAME=<your-cloud-name>
     CLOUDINARY_API_KEY=<your-api-key>
     CLOUDINARY_API_SECRET=<your-api-secret>
     FRONTEND_URL=<will-be-your-vercel-url>
     ```

2. **Update package.json scripts** (already done)
   - Start script uses `node src/server.js`

### Step 2: Deploy to Render

1. Go to [render.com](https://render.com) and sign in with GitHub
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `Virtual-Event-Platform-SaaS-`
4. Configure:
   - **Name**: `virtual-event-platform-api` (or your choice)
   - **Region**: Choose closest to you
   - **Branch**: `main` (we'll merge feature/realtime-chat first)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

5. Add Environment Variables (click "Advanced" → "Add Environment Variable"):
   - Copy all variables from your `.env` file
   - Update `FRONTEND_URL` later after Vercel deployment
   - Set `NODE_ENV=production`

6. Click "Create Web Service"
   - Wait 5-10 minutes for first build
   - You'll get a URL like: `https://virtual-event-platform-api.onrender.com`

7. **Important**: Free tier spins down after inactivity
   - First request after inactivity takes ~30-60 seconds
   - Mention this in your resume/portfolio

---

## Part 2: Frontend Deployment (Vercel)

### Step 1: Prepare Frontend for Production

1. **Update API base URL** in `frontend/src/api/axios.js`:
   ```javascript
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
   ```

2. **Update Socket URL** in `frontend/src/context/SocketContext.jsx`:
   ```javascript
   const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
   ```

3. **Create environment variables file**: `frontend/.env.production`
   ```
   VITE_API_URL=<your-render-backend-url>
   VITE_SOCKET_URL=<your-render-backend-url>
   ```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

5. Add Environment Variables:
   - `VITE_API_URL`: `https://virtual-event-platform-api.onrender.com` (your Render URL)
   - `VITE_SOCKET_URL`: Same as above

6. Click "Deploy"
   - Takes 2-3 minutes
   - You'll get a URL like: `https://virtual-event-platform.vercel.app`

### Step 3: Update Backend CORS

1. Go back to Render dashboard
2. Update environment variable:
   - `FRONTEND_URL=https://virtual-event-platform.vercel.app` (your Vercel URL)
3. Trigger manual redeploy (or it auto-deploys on env change)

---

## Part 3: Final Configuration

### Update Socket.io CORS in Backend

Edit `backend/src/config/socket.js`:
```javascript
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
});
```

### Update Express CORS in Backend

Edit `backend/src/server.js`:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
```

---

## Part 4: Testing Deployment

1. **Visit your Vercel URL**
2. **Test Authentication**:
   - Register new account
   - Login
   - Upload avatar
3. **Test Events**:
   - Browse events
   - Register for event
   - Become organizer
   - Create event
4. **Test Real-time Chat**:
   - Join event
   - Send messages
   - Check typing indicators
   - Test with multiple browser tabs

---

## Part 5: For Your Resume

### Live URLs to Include:
- **Live Site**: `https://your-app.vercel.app`
- **GitHub Repo**: `https://github.com/rishiiih/Virtual-Event-Platform-SaaS-`
- **API Backend**: `https://your-api.onrender.com` (optional)

### Project Description Template:
```
Virtual Event Platform (MERN + Socket.io)
• Full-stack SaaS platform for virtual event management with real-time features
• Tech Stack: React, Node.js, Express, MongoDB, Socket.io, Tailwind CSS
• Features: JWT authentication, role-based access, CRUD operations, real-time chat, file uploads
• Deployed on Vercel (frontend) and Render (backend) with MongoDB Atlas
```

### Key Features to Highlight:
- ✅ Full-stack development (MERN)
- ✅ Real-time communication (Socket.io)
- ✅ Authentication & Authorization (JWT, role-based)
- ✅ RESTful API design
- ✅ Cloud deployment (Vercel, Render, MongoDB Atlas, Cloudinary)
- ✅ Responsive UI (Tailwind CSS)
- ✅ State management (Context API)

---

## Troubleshooting

### Backend Won't Start on Render
- Check logs in Render dashboard
- Verify all environment variables are set
- Ensure MongoDB Atlas IP whitelist includes `0.0.0.0/0` (allow all)

### Frontend Can't Connect to Backend
- Verify `VITE_API_URL` is correct
- Check browser console for CORS errors
- Ensure `FRONTEND_URL` is set correctly on backend

### Socket.io Not Connecting
- Check browser console for connection errors
- Verify `VITE_SOCKET_URL` matches backend URL
- Ensure Render supports WebSockets (it does on free tier)
- First connection to free tier backend takes 30-60 seconds

### MongoDB Atlas Connection Issues
- Go to MongoDB Atlas → Network Access
- Add `0.0.0.0/0` to IP whitelist (allow from anywhere)
- Verify connection string includes correct username/password

---

## Cost Breakdown (All Free Tier)
- ✅ Vercel: Free for personal projects
- ✅ Render: Free tier (spins down after 15 min inactivity)
- ✅ MongoDB Atlas: Free M0 cluster (512MB)
- ✅ Cloudinary: Free tier (25 credits/month)

**Total Cost: $0/month** 🎉

---

## Next Steps After Deployment

1. Merge `feature/realtime-chat` to `main`
2. Update README.md with live demo link
3. Add screenshots to repository
4. Consider custom domain (optional)
5. Continue development:
   - Add ChatRoom to EventDetailPage UI
   - Event analytics dashboard
   - Payment integration
   - Email notifications

---

## Notes
- Free tier Render services sleep after 15 minutes of inactivity
- First request after sleep takes ~30-60 seconds to wake up
- For resume purposes, this is perfectly acceptable
- Mention "deployed on cloud platforms" in your resume
