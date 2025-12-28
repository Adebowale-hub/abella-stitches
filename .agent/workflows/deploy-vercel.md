---
description: Deploy Abella Stitches to Vercel (Full Stack)
---

# 🚀 Deploy Both Frontend & Backend to Vercel

This guide shows you how to deploy the entire Abella Stitches application (frontend + backend) to Vercel using a monorepo setup.

---

## Why Vercel for Both?

✅ **Single Platform** - Manage everything in one place
✅ **Free Tier** - Generous limits for both frontend and serverless functions
✅ **Automatic HTTPS** - SSL certificates included
✅ **Easy Environment Variables** - Centralized configuration
✅ **Git Integration** - Auto-deploy on push

---

## Prerequisites

- [ ] GitHub account with your code pushed
- [ ] Vercel account (https://vercel.com)
- [ ] MongoDB Atlas cluster (https://www.mongodb.com/cloud/atlas)
- [ ] Paystack account with API keys
- [ ] SMTP credentials (Gmail App Password or SendGrid)
- [ ] EmailJS account

---

## Phase 1: Prepare Your Project Structure

### 1.1 Create Vercel Configuration

Create `vercel.json` in your **project root** (`adh/`):

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "backend/src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/src/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/dist/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 1.2 Update Backend for Serverless

Since Vercel uses serverless functions, we need to export the Express app properly.

Update `backend/src/server.js` - **ADD at the end**:

```javascript
// Export for Vercel serverless
export default app;
```

**Full updated server.js should look like this at the end:**
```javascript
// ... (all your existing code)

// Start server
const PORT = process.env.PORT || 5000;

// Only listen if not in serverless environment (Vercel)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export for Vercel serverless
export default app;
```

### 1.3 Update Frontend Build Script

Update `frontend/package.json` scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "vercel-build": "npm run build"
  }
}
```

### 1.4 Update Frontend API Configuration

Since both are on the same domain, update `frontend/src/utils/api.js`:

```javascript
// Use relative path - no need for VITE_API_URL
const API_BASE = '/api';

// Rest of your code stays the same...
```

---

## Phase 2: Database Setup (MongoDB Atlas)

Follow the same MongoDB setup as in the main deployment guide:

### 2.1 Create MongoDB Cluster
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a **FREE M0** cluster
3. Choose region closest to your users

### 2.2 Configure Database Access
1. Database Access → Add New Database User
2. Create username and password (save these!)
3. Privileges: "Read and write to any database"

### 2.3 Configure Network Access
1. Network Access → Add IP Address
2. **Allow Access from Anywhere** (0.0.0.0/0)
3. Confirm

### 2.4 Get Connection String
```
mongodb+srv://username:password@cluster.xxxxx.mongodb.net/abellastitches?retryWrites=true&w=majority
```

---

## Phase 3: Deploy to Vercel

### 3.1 Push to GitHub

```bash
# From your project root (adh/)
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

### 3.2 Import to Vercel

1. Go to https://vercel.com/dashboard
2. Click **Add New** → **Project**
3. **Import** your GitHub repository
4. Configure project:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave as root)
   - **Build Command**: Leave empty (handled by vercel.json)
   - **Output Directory**: Leave empty

### 3.3 Add Environment Variables

Click **Environment Variables** and add ALL of these:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/abellastitches?retryWrites=true&w=majority

# JWT Secret (generate at https://www.grc.com/passwords.htm)
JWT_SECRET=your_very_long_random_secret_at_least_32_characters_here

# Environment
NODE_ENV=production
PORT=5000

# Frontend URL (will be your Vercel URL)
FRONTEND_URL=https://your-project-name.vercel.app

# Paystack (use LIVE keys for production)
PAYSTACK_SECRET_KEY=sk_live_your_paystack_live_secret_key

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
SMTP_FROM=Abella Stitches <your_email@gmail.com>

# EmailJS (for contact forms)
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_CONTACT_TEMPLATE_ID=your_contact_template_id
VITE_EMAILJS_NEWSLETTER_TEMPLATE_ID=your_newsletter_template_id
```

### 3.4 Deploy

1. Click **Deploy**
2. Wait 2-5 minutes for deployment
3. Vercel will provide a URL: `https://your-project-name.vercel.app`

---

## Phase 4: Update Environment Variables

After first deployment, you need to update `FRONTEND_URL`:

1. Go to Project **Settings** → **Environment Variables**
2. Edit `FRONTEND_URL` to your actual Vercel URL
3. **Redeploy** (Deployments → ⋯ → Redeploy)

---

## Phase 5: Seed Production Database

### Option A: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link to your project
vercel link

# Run seed command
vercel env pull .env.local
cd backend
npm run seed
```

### Option B: Temporary Seed Script

1. Create `backend/src/seed-production.js`:

```javascript
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import AdminUser from './models/AdminUser.js';

dotenv.config();

const seedProduction = async () => {
    try {
        await connectDB();
        
        // Check if admin exists
        const existingAdmin = await AdminUser.findOne({ email: 'admin@abellastitches.com' });
        
        if (existingAdmin) {
            console.log('Admin already exists');
            process.exit(0);
        }

        // Create admin
        await AdminUser.create({
            email: 'admin@abellastitches.com',
            password: 'Admin123!' // CHANGE THIS IMMEDIATELY
        });

        console.log('✅ Admin user created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

seedProduction();
```

2. Run locally with production MongoDB:
```bash
# Set production MongoDB URI temporarily
MONGODB_URI="your_production_mongodb_uri" node backend/src/seed-production.js
```

---

## Phase 6: Post-Deployment Configuration

### 6.1 Test Your Deployment

Visit your Vercel URL and test:
- [ ] Homepage loads
- [ ] Products display correctly
- [ ] Admin login works at `/admin`
- [ ] Can create/edit products in dashboard
- [ ] Newsletter signup works
- [ ] Contact form works
- [ ] API endpoints respond (check `/api/products`)

### 6.2 Check Serverless Function Logs

1. Go to Vercel Dashboard → Your project
2. Click **Functions** tab
3. Check logs for any errors

### 6.3 Update Custom Domain (Optional)

1. Project Settings → **Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. Update `FRONTEND_URL` environment variable to your custom domain

---

## Important Notes for Vercel Deployment

### Serverless Function Limits (Free Tier)

- **Execution Timeout**: 10 seconds (hobby tier)
- **Payload Size**: 4.5 MB request/response
- **Memory**: 1024 MB
- **Deployments**: Unlimited

For most e-commerce operations, these limits are fine. If you need longer execution times, consider upgrading to Vercel Pro.

### Database Connections

Vercel serverless functions create a new connection on each invocation. MongoDB recommends:

1. **Use Connection Pooling** (already configured in your Mongoose setup)
2. **Set `bufferCommands: false`** in Mongoose (optional for better error handling)

Update `backend/src/config/db.js` if needed:

```javascript
const options = {
    bufferCommands: false,
    serverSelectionTimeoutMS: 5000
};

await mongoose.connect(process.env.MONGODB_URI, options);
```

### Environment Variables

All variables are shared between frontend and backend on Vercel, so you can access them in both contexts.

---

## Troubleshooting

### Issue: 404 on API Routes

**Solution**: Make sure `vercel.json` is in the **root** directory and routes are configured correctly.

### Issue: Database Connection Timeout

**Solution**: 
1. Check MongoDB Atlas network access allows 0.0.0.0/0
2. Verify connection string is correct
3. Check Vercel function logs for detailed error

### Issue: Frontend Can't Reach Backend

**Solution**: 
1. Ensure `frontend/src/utils/api.js` uses `/api` (relative path)
2. Check `vercel.json` routes are correct
3. Verify environment variables are set

### Issue: Build Fails

**Solution**:
1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Verify `vercel.json` syntax is correct

### Issue: Functions Timeout

**Solution**:
1. Optimize database queries
2. Add indexes to MongoDB collections
3. Consider upgrading to Vercel Pro (60s timeout)

---

## Monitoring & Performance

### Enable Analytics

1. Vercel Dashboard → Your project
2. Go to **Analytics** tab
3. View page loads, performance metrics

### Monitor Function Execution

1. Click **Functions** tab
2. See execution times and errors
3. Optimize slow functions

### Set Up Alerts

1. Project Settings → **Notifications**
2. Add Slack/email for deployment failures
3. Monitor error rates

---

## Git-Based Deployment

After initial setup, deploying is automatic:

```bash
# Make changes to your code
git add .
git commit -m "Update feature"
git push origin main

# Vercel automatically deploys! 🎉
```

### Preview Deployments

Every branch gets its own preview URL:
```bash
git checkout -b new-feature
# Make changes
git push origin new-feature
# Vercel creates: https://your-project-new-feature.vercel.app
```

---

## Production Checklist

Before going live:

- [ ] MongoDB Atlas cluster is configured
- [ ] All environment variables are set in Vercel
- [ ] Admin account is created via seed script
- [ ] Default admin password has been changed
- [ ] Using Paystack **LIVE** keys (not test)
- [ ] SMTP email sending works
- [ ] Tested complete checkout flow
- [ ] Custom domain configured (if applicable)
- [ ] HTTPS is working (automatic with Vercel)

---

## Costs

**Vercel Hobby (Free Tier)**:
- Unlimited deployments
- 100 GB bandwidth/month
- Automatic HTTPS
- Serverless functions (10s timeout)

**When to upgrade to Pro ($20/month)**:
- Need more bandwidth (1 TB)
- Longer function timeouts (60s)
- Custom domains with advanced features
- Team collaboration

**MongoDB Atlas**:
- Free tier: 512 MB storage
- Sufficient for starting out

**Total Cost to Start**: **$0** (completely free!)

---

## Quick Reference

```bash
# Deploy manually
vercel --prod

# View logs
vercel logs

# Pull environment variables
vercel env pull

# Add environment variable
vercel env add VARIABLE_NAME

# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback
```

---

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Serverless Functions**: https://vercel.com/docs/functions
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **Vercel Community**: https://github.com/vercel/vercel/discussions

---

## 🎉 You're Done!

Your full-stack e-commerce platform is now live on Vercel!

**Your URLs**:
- **Production**: `https://your-project-name.vercel.app`
- **Admin**: `https://your-project-name.vercel.app/admin`
- **API**: `https://your-project-name.vercel.app/api`

**Next Steps**:
1. Change admin password
2. Add products via dashboard
3. Test checkout with real payment
4. Share with customers! 🚀
