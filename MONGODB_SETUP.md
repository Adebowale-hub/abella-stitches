# MongoDB Setup Guide for AdireHub Fashion

## Quick Setup Options

### Option 1: MongoDB Atlas (Cloud - Recommended for Quick Start)

This is the easiest option and doesn't require any local installation.

1. **Create Account**
   - Visit [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
   - Sign up for a free account

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier (M0 Sandbox)
   - Select a cloud provider and region (choose one close to you)
   - Click "Create Cluster" (takes 3-5 minutes)

3. **Configure Database Access**
   - Click "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `adirehub`
   - Password: Generate a strong password or use: `Fashion2024!`
   - User Privileges: "Atlas Admin"
   - Click "Add User"

4. **Configure Network Access**
   - Click "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String**
   - Click "Database" in left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Driver: Node.js, Version: 5.5 or later
   - Copy the connection string (looks like):
     ```
     mongodb+srv://adirehub:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual password

6. **Update Backend .env**
   - Open `backend/.env`
   - Replace the MONGODB_URI line with your connection string:
     ```
     MONGODB_URI=mongodb+srv://adirehub:Fashion2024!@cluster0.xxxxx.mongodb.net/adirehub?retryWrites=true&w=majority
     ```
   - **Important**: Add `/adirehub` before the `?` to specify the database name

---

### Option 2: Local MongoDB Installation (Windows)

If you prefer running MongoDB locally:

1. **Download MongoDB**
   - Visit [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
   - Select:
     - Version: Latest (e.g., 7.0.4)
     - Platform: Windows
     - Package: msi
   - Click "Download"

2. **Install MongoDB**
   - Run the downloaded `.msi` file
   - Choose "Complete" installation
   - Install MongoDB as a service (check the box)
   - Install MongoDB Compass (GUI tool) - optional but recommended
   - Complete the installation

3. **Verify Installation**
   - Open PowerShell
   - Run: `mongod --version`
   - Should show MongoDB version

4. **Start MongoDB Service** (if not auto-started)
   - Open Services (Win + R, type `services.msc`)
   - Find "MongoDB Server"
   - Right-click → Start

5. **Verify Connection**
   - Open PowerShell
   - Run: `mongosh` (MongoDB Shell)
   - Should connect to `mongodb://localhost:27017`
   - Type `exit` to quit

6. **Backend .env is Already Configured**
   - The default `MONGODB_URI=mongodb://localhost:27017/adirehub` should work

---

## After MongoDB is Ready

### Seed the Database

```powershell
cd backend
npm run seed
```

**Expected Output:**
```
MongoDB Connected: cluster0.xxxxx.mongodb.net (or localhost)
✓ Admin user created
✓ Sample products created

=================================
Seeding complete!
=================================
Admin credentials:
Email: admin@adirehub.com
Password: Admin123!
=================================
```

### Start the Application

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

---

## Testing MongoDB Connection

If you want to test the connection before seeding:

```powershell
cd backend
node -e "const mongoose = require('mongoose'); require('dotenv').config(); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('✓ Connected!')).catch(err => console.error('✗ Error:', err.message));"
```

Should output: `✓ Connected!`

---

## Troubleshooting

### Error: "MongooseServerSelectionError"
- **Atlas**: Check that your IP is whitelisted in Network Access
- **Local**: Verify MongoDB service is running

### Error: "Authentication failed"
- **Atlas**: Check username/password in connection string
- **Local**: No authentication needed for default setup

### Error: "Cannot connect to localhost:27017"
- **Local**: MongoDB service is not running
  - Open Services → Start "MongoDB Server"

### Connection String Issues
- Ensure password doesn't contain special characters, or URL-encode them
- Ensure database name is specified: `/adirehub` before query parameters
- Check for typos in the connection string

---

## MongoDB Compass (Optional GUI Tool)

If you installed MongoDB Compass or want to download it:

1. Open MongoDB Compass
2. Connect using your connection string
3. You'll see the `adirehub` database after seeding
4. Collections: `adminusers` and `products`
5. You can browse, edit, and query data visually

---

## Summary

1. Choose MongoDB Atlas (cloud) or local installation
2. Get connection string
3. Update `backend/.env` with connection string
4. Run `npm run seed` in backend directory
5. Start backend and frontend servers
6. Navigate to `http://localhost:5173`

You're ready to go! 🚀
