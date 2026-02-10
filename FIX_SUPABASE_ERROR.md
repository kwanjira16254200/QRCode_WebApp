# 🔧 Fix: "supabaseUrl is required" Error

## ❌ Error Message
```
Error saving QR Code: supabaseUrl is required.
```

This error occurs when trying to save Image QR Codes with the Gallery feature.

## 🔍 Root Cause

The client-side Supabase configuration is missing environment variables. The file `/client/src/config/supabase.js` requires:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

But these are not set in your `.env.development` and `.env.production` files.

## ✅ Solution

### Step 1: Get Your Supabase Credentials

1. Go to https://app.supabase.com
2. Select your project (or create one if you don't have it)
3. Go to **Settings** → **API**
4. Copy these two values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (very long string)

### Step 2: Update Environment Files

#### Edit `/client/.env.development`

Add these lines:
```env
# Development Environment Variables
VITE_API_URL=http://localhost:5000

# Supabase Configuration (Required for Gallery feature)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Edit `/client/.env.production`

Add these lines:
```env
# Production Environment Variables
VITE_API_URL=https://qr-code-web-33iwisc9p-qr-code-web-apps-projects.vercel.app

# Supabase Configuration (Required for Gallery feature)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Replace:**
- `https://xxxxx.supabase.co` with YOUR actual Project URL
- `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` with YOUR actual anon public key

### Step 3: Rebuild and Redeploy

After adding the environment variables:

```bash
# In /client directory
cd client

# Rebuild the app
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

### Step 4: Test

1. Go to https://qrcode-webapp.web.app
2. Hard reload: `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)
3. Try creating an Image QR Code with multiple images
4. The error should be gone!

## 🎯 Quick Checklist

- [ ] Got Supabase Project URL from Supabase Dashboard
- [ ] Got Supabase anon public key from Supabase Dashboard
- [ ] Added `VITE_SUPABASE_URL` to `.env.development`
- [ ] Added `VITE_SUPABASE_ANON_KEY` to `.env.development`
- [ ] Added `VITE_SUPABASE_URL` to `.env.production`
- [ ] Added `VITE_SUPABASE_ANON_KEY` to `.env.production`
- [ ] Rebuilt the app (`npm run build`)
- [ ] Deployed to Firebase (`firebase deploy --only hosting`)
- [ ] Hard reloaded the website
- [ ] Tested image upload

## 📝 Notes

- **DO NOT** commit `.env` files to Git (they should be in `.gitignore`)
- The `VITE_` prefix is required for Vite to expose the variables to the client
- Make sure there are no spaces or line breaks in the keys
- The anon key is safe to expose in the client (it's public)

## 🔗 Related Files

- `/client/src/config/supabase.js` - Supabase client configuration
- `/client/src/utils/supabaseStorage.js` - Image upload functions
- `/client/.env.development` - Development environment variables
- `/client/.env.production` - Production environment variables
- `/client/.env.example` - Example template

## 📚 More Info

See the complete Gallery setup guide: `GALLERY_SETUP.md`
