# 🚀 Production Deployment Guide

## Current Issue
Your frontend is deployed to Firebase Hosting, but the backend API is not deployed yet. This causes 403/404 errors when trying to login or register.

## Solution: Deploy Backend Server

You need to deploy your Node.js backend to a hosting service. Here are the recommended options:

### Option 1: Render.com (Recommended - Free Tier Available)

1. **Create account** at https://render.com

2. **Create new Web Service**
   - Connect your GitHub repository
   - Select the root directory (where server/index.js is)
   - Build Command: `npm install`
   - Start Command: `node server/index.js`

3. **Set Environment Variables** in Render dashboard:
   ```
   PORT=5000
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_KEY=your-supabase-service-key
   JWT_SECRET=your-jwt-secret
   NODE_ENV=production
   CLIENT_URL=https://qrcode-webapp.web.app
   ```

4. **Deploy** - Render will give you a URL like: `https://your-app.onrender.com`

5. **Update Frontend** - Edit `client/.env.production`:
   ```
   VITE_API_URL=https://your-app.onrender.com
   ```

6. **Rebuild and redeploy frontend**:
   ```bash
   cd client
   npm run build
   firebase deploy
   ```

### Option 2: Railway.app

1. **Create account** at https://railway.app
2. **New Project** → Deploy from GitHub
3. **Add Environment Variables** (same as above)
4. **Deploy** - Railway gives you a URL
5. **Update** `client/.env.production` with the Railway URL
6. **Rebuild frontend**

### Option 3: Fly.io

1. Install flyctl: `brew install flyctl`
2. Login: `fly auth login`
3. Launch app: `fly launch`
4. Set secrets: `fly secrets set JWT_SECRET=xxx SUPABASE_URL=xxx ...`
5. Deploy: `fly deploy`

## Quick Fix for Testing

If you want to test locally with the deployed frontend:

1. **Update** `client/.env.production`:
   ```
   VITE_API_URL=http://localhost:5000
   ```

2. **Rebuild**:
   ```bash
   cd client
   npm run build
   firebase deploy
   ```

3. **Run backend locally**:
   ```bash
   npm run server
   ```

4. **Important**: Update CORS in `server/index.js` to allow your Firebase domain:
   ```javascript
   app.use(cors({
     origin: ['http://localhost:5173', 'https://qrcode-webapp.web.app'],
     credentials: true
   }));
   ```

## After Backend Deployment

1. Update `client/.env.production` with your backend URL
2. Rebuild frontend: `cd client && npm run build`
3. Deploy: `firebase deploy`
4. Test login/register on https://qrcode-webapp.web.app

## Environment Variables Needed

Make sure your backend has these environment variables:
- `PORT` - Server port (usually 5000 or set by hosting provider)
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_KEY` - Supabase service role key
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Set to "production"
- `CLIENT_URL` - Your Firebase hosting URL (for CORS)
