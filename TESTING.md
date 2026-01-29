# API Testing Guide

## Start Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected: virtualeventplatform.ld9sxfp.mongodb.net
🚀 Server running on port 5000
📝 Environment: development
🔗 Health check: http://localhost:5000/health
```

---

## Test Endpoints Using PowerShell

### 1. Health Check
```powershell
curl http://localhost:5000/health
```

Expected: `{"status":"success","message":"Server is running","timestamp":"..."}`

---

### 2. Register a New User
```powershell
curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"password\":\"password123\",\"role\":\"attendee\"}'
```

Expected Response:
```json
{
  "status": "success",
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "attendee",
      "avatar": null
    }
  }
}
```

**Copy the token from the response!**

---

### 3. Login
```powershell
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"john@example.com\",\"password\":\"password123\"}'
```

---

### 4. Get Profile (Protected Route)
Replace `YOUR_TOKEN_HERE` with the token from registration/login:

```powershell
curl -X GET http://localhost:5000/api/auth/me `
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Expected:
```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "attendee",
      "avatar": null
    }
  }
}
```

---

### 5. Update Profile
```powershell
curl -X PUT http://localhost:5000/api/auth/profile `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_TOKEN_HERE" `
  -d '{\"name\":\"John Smith\"}'
```

---

## Alternative: Use Postman or Thunder Client (VS Code Extension)

If curl is difficult in PowerShell, I recommend:
- **Thunder Client** (VS Code extension) - Install from Extensions marketplace
- **Postman** - Desktop app

---

## Expected Test Flow

1. ✅ Register user → Get token
2. ✅ Login with same credentials → Get token
3. ✅ Access /api/auth/me with token → Get user profile
4. ✅ Update profile with token → See changes

---

Let me know when the server is running and I'll help you test!
