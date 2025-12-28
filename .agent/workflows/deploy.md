---
description: Deploy Abella Stitches to Production
---

# 🚀 Abella Stitches - Production Deployment Workflow

This guide walks you through deploying the Abella Stitches e-commerce platform to production using **Vercel** for the frontend and **Render/Railway** for the backend.

---

## Prerequisites Checklist

Before deployment, ensure you have:

- [ ] GitHub/GitLab repository for your project
- [ ] MongoDB Atlas account (free tier available at https://www.mongodb.com/cloud/atlas)
- [ ] Vercel account (https://vercel.com)
- [ ] Render or Railway account (https://render.com or https://railway.app)
- [ ] Paystack account with API keys (https://paystack.com)
- [ ] SMTP credentials (Gmail App Password, SendGrid, or Mailgun)
- [ ] EmailJS account for contact forms (https://www.emailjs.com)

---

## Phase 1: Database Setup (MongoDB Atlas)

### 1.1 Create MongoDB Cluster

1. Go to https://www.mongodb.com/cloud/atlas and sign up/login
2. Click "Build a Database"
3. Choose **FREE** tier (M0 Sandbox)
4. Select your preferred cloud provider and region (closest to your users)
5. Name your cluster (e.g., "abella-stitches")
6. Click "Create Cluster"

### 1.2 Configure Database Access

1. In the left sidebar, click **Database Access**
2. Click **Add New Database User**
3. Create a username and strong password (save these securely!)
4. Database User Privileges: Select "Read and write to any database"
5. Click **Add User**

### 1.3 Configure Network Access

1. In the left sidebar, click **Network Access**
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (0.0.0.0/0)
   - Note: For production, restrict to your server IPs
4. Click **Confirm**

### 1.4 Get Connection String

1. Go to **Database** → Click **Connect**
2. Choose **Connect your application**
3. Copy the connection string (looks like: `mongodb+srv://username:<password>@cluster.xxxxx.mongodb.net/`)
4. Replace `<password>` with your actual database password
5. Add database name at the end: `...mongodb.net/abellastitches`

**Your final connection string:**
```
mongodb+srv://username:password@cluster.xxxxx.mongodb.net/abellastitches?retryWrites=true&w=majority
```

---

## Phase 2: Backend Deployment (Railway/Render)

### Option A: Deploy to Railway (Recommended)

#### 2A.1 Push Code to GitHub

```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

#### 2A.2 Deploy to Railway

1. Go to https://railway.app and sign up with GitHub
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your `adh` repository
4. Railway will auto-detect Node.js
5. Click on the deployment

#### 2A.3 Configure Environment Variables

1. Go to **Variables** tab
2. Add the following environment variables:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/abellastitches
JWT_SECRET=your-very-long-secure-random-string-at-least-32-characters
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
PAYSTACK_SECRET_KEY=sk_live_your_paystack_secret_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=Abella Stitches <your_email@gmail.com>
```

#### 2A.4 Configure Build Settings

1. Go to **Settings** → **Build**
2. Root Directory: `/backend`
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Click **Deploy**

#### 2A.5 Get Backend URL

1. Go to **Settings** → **Domains**
2. Railway will generate a URL like: `https://your-app.up.railway.app`
3. **Save this URL** - you'll need it for frontend configuration

---

### Option B: Deploy to Render

#### 2B.1 Push Code to GitHub

Same as Railway (2A.1)

#### 2B.2 Create Web Service

1. Go to https://render.com and sign up with GitHub
2. Click **New** → **Web Service**
3. Connect your repository
4. Configuration:
   - **Name**: abella-stitches-backend
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

#### 2B.3 Add Environment Variables

In the **Environment** section, add all variables from 2A.3

#### 2B.4 Deploy

1. Click **Create Web Service**
2. Wait for deployment (5-10 minutes)
3. Your backend URL: `https://abella-stitches-backend.onrender.com`

---

## Phase 3: Seed Production Database

### 3.1 Connect to Railway/Render Shell

**Railway:**
1. In your project, click the service
2. Click **Shell** tab or use Railway CLI

**Render:**
1. Go to your web service
2. Click **Shell** in the top menu

### 3.2 Run Seed Script

```bash
cd backend
npm run seed
```

This creates the admin user: `admin@abellastitches.com` / `Admin123!`

**⚠️ IMPORTANT**: Change this password immediately after first login!

---

## Phase 4: Frontend Deployment (Vercel)

### 4.1 Create Frontend Environment File

Create `frontend/.env.production`:

```env
VITE_API_URL=https://your-backend-url.railway.app

# EmailJS Configuration
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_CONTACT_TEMPLATE_ID=your_contact_template_id
VITE_EMAILJS_NEWSLETTER_TEMPLATE_ID=your_newsletter_template_id
```

### 4.2 Update Vite Config

Ensure `frontend/vite.config.js` has:

```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
```

### 4.3 Deploy to Vercel

#### Via Vercel Dashboard:

1. Go to https://vercel.com and sign up with GitHub
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configuration:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. **Environment Variables** - Add all from `.env.production`

6. Click **Deploy**

#### Via Vercel CLI:

```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

### 4.4 Get Frontend URL

Vercel will provide a URL like: `https://abella-stitches.vercel.app`

---

## Phase 5: Final Configuration

### 5.1 Update Backend with Frontend URL

1. Go back to Railway/Render
2. Update environment variable:
   ```
   FRONTEND_URL=https://abella-stitches.vercel.app
   ```
3. Redeploy the backend

### 5.2 Update CORS Settings (if needed)

If you encounter CORS errors, verify `backend/src/server.js`:

```javascript
const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5173'
];
```

### 5.3 Configure Custom Domain (Optional)

**Vercel:**
1. Go to Project Settings → Domains
2. Add your custom domain (e.g., www.abellastitches.com)
3. Update DNS records as instructed

**Railway:**
1. Settings → Domains → Add Custom Domain
2. Update CNAME record

---

## Phase 6: Post-Deployment Verification

### 6.1 Test Checklist

- [ ] Frontend loads correctly
- [ ] Admin login works (`/admin`)
- [ ] Admin can create/edit/delete products
- [ ] Public site displays products
- [ ] Newsletter subscription works
- [ ] Contact form sends emails
- [ ] Payment flow works (test mode)
- [ ] Order confirmation emails are sent
- [ ] Order management works in admin dashboard

### 6.2 Security Checklist

- [ ] Changed default admin password
- [ ] Using production Paystack keys
- [ ] HTTPS enabled on both frontend and backend
- [ ] Environment variables secured (not in code)
- [ ] MongoDB network access configured
- [ ] JWT_SECRET is strong and unique

### 6.3 Switch Paystack to Live Mode

1. Log into Paystack dashboard
2. Go to Settings → API Keys & Webhooks
3. Copy your **Live Secret Key** (starts with `sk_live_`)
4. Update backend environment variable:
   ```
   PAYSTACK_SECRET_KEY=sk_live_your_actual_live_key
   ```
5. Redeploy backend

---

## Phase 7: Monitoring & Maintenance

### 7.1 Monitor Application

**Railway/Render:**
- Check **Metrics** tab for CPU/Memory usage
- Review **Logs** for errors

**MongoDB Atlas:**
- Monitor database usage in Atlas dashboard
- Set up alerts for storage/connections

**Vercel:**
- Analytics tab shows page views and performance
- Function logs show API calls

### 7.2 Backup Database

MongoDB Atlas automatically creates backups on paid tiers. For free tier:

```bash
# Export database periodically
mongodump --uri="your_mongodb_connection_string" --out=./backup
```

---

## Troubleshooting

### Backend won't start
- Check logs in Railway/Render
- Verify all environment variables are set
- Ensure MongoDB connection string is correct

### Frontend can't reach backend
- Verify `VITE_API_URL` is correct
- Check CORS configuration
- Ensure backend is running

### Payment not working
- Verify Paystack keys (test vs live)
- Check `FRONTEND_URL` in backend env

### Emails not sending
- Verify SMTP credentials
- For Gmail, ensure 2FA and App Password are set
- Consider using SendGrid for production

---

## Quick Reference Commands

```bash
# Backend local test
cd backend
npm run dev

# Frontend local test
cd frontend
npm run dev

# Build frontend for production
cd frontend
npm run build

# Seed database
cd backend
npm run seed

# View Railway logs
railway logs

# Deploy to Vercel
cd frontend
vercel --prod
```

---

## Support Resources

- **MongoDB Atlas Documentation**: https://docs.atlas.mongodb.com
- **Railway Documentation**: https://docs.railway.app
- **Render Documentation**: https://render.com/docs
- **Vercel Documentation**: https://vercel.com/docs
- **Paystack API Docs**: https://paystack.com/docs/api

---

## 🎉 Congratulations!

Your Abella Stitches e-commerce platform is now live in production!

**Next Steps:**
1. Add your first products via admin dashboard
2. Test the complete checkout flow
3. Share your website with customers
4. Monitor orders and manage inventory

**Production URLs:**
- Frontend: https://your-app.vercel.app
- Backend API: https://your-app.railway.app
- Admin Dashboard: https://your-app.vercel.app/admin
