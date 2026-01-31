# Fix for Socket Connection Error

## The Issue
The "Invalid namespace" error occurs because the backend server needs to be restarted to load the Socket.io code.

## Solution - Restart Backend Server

### Step 1: Stop the current backend server
Press `Ctrl+C` in the terminal running the backend, or kill the node process.

### Step 2: Restart the backend
```bash
cd backend
npm run dev
```

### Step 3: You should see this in the console:
```
✅ MongoDB Connected: ...
🚀 Server running on port 5000
📝 Environment: development
🔗 Health check: http://localhost:5000/health
💬 Socket.io initialized
```

The key line is **"💬 Socket.io initialized"** - if you see this, the socket server is ready!

### Step 4: Refresh your frontend
After the backend restarts, refresh your browser and the socket connection should work.

## Verification
When you visit an event page, you should see in the browser console:
```
✅ Socket connected
```

And in the backend terminal, you'll see:
```
✅ User connected: YourName (userId)
```

## Still Having Issues?

If the error persists, check:

1. **Backend console** - Make sure you see "💬 Socket.io initialized"
2. **Browser console** - Check for any error messages
3. **Token** - Make sure you're logged in (token in localStorage)
4. **Port** - Backend should be on port 5000

## Quick Test
Try this in browser console to check token:
```javascript
localStorage.getItem('token')
```
If it returns `null`, you need to log in first!
