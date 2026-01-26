# 🔧 Troubleshooting Guide - 403 Forbidden Error

## ❌ Problem: "Failed to load resource: 403 (Forbidden)"

This error occurs when Supabase Row Level Security (RLS) blocks your API requests.

---

## ✅ Solution 1: Disable RLS (Recommended for Development)

### Quick Fix - Run this SQL in Supabase:

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Run this SQL:

```sql
-- Disable RLS on all tables
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE links DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics DISABLE ROW LEVEL SECURITY;
```

3. Restart your server:
```bash
npm run dev
```

✅ **This should immediately fix the 403 error!**

---

## ✅ Solution 2: Use Service Role Key (More Secure)

If you want to keep RLS enabled for production readiness:

### Step 1: Get Service Role Key

1. Go to **Supabase Dashboard**
2. **Settings** → **API**
3. Find **service_role** key (under "Project API keys")
4. Copy it (⚠️ **NEVER expose this publicly!**)

### Step 2: Update Your `.env` File

Add the service role key:

```env
PORT=5000
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=sb_publishable_94DcwDt23uj_OMq7iqI2Zg_zsN2fFbi
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-service-role-key-here
JWT_SECRET=qr-code-dynamic-app-secret-key-2024-production-ready
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Step 3: Restart Server

```bash
npm run dev
```

The backend will now use `SUPABASE_SERVICE_KEY` which bypasses RLS.

---

## 🔍 How to Verify the Fix

### Test 1: Check Server Logs

When you run `npm run dev`, you should see:

```
✅ Supabase connected
🚀 Server running on port 5000
```

If you see errors, check your `.env` file.

### Test 2: Test Health Endpoint

Open browser or use curl:

```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{"status":"OK","message":"Server is running","database":"Supabase"}
```

### Test 3: Register a User

1. Open http://localhost:5173
2. Click "สมัครสมาชิก" (Register)
3. Fill in the form
4. If successful, you'll be redirected to Dashboard

---

## 🐛 Other Common Issues

### Issue: "Missing Supabase credentials"

**Error:**
```
❌ Missing Supabase credentials in .env file
```

**Solution:**
1. Make sure `.env` file exists in root folder
2. Check that `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set
3. No extra spaces or quotes around values

### Issue: "relation does not exist"

**Error:**
```
relation "users" does not exist
```

**Solution:**
Run the SQL schema in Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  original_url TEXT NOT NULL,
  short_code VARCHAR(50) UNIQUE NOT NULL,
  clicks INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID NOT NULL REFERENCES links(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  referer TEXT,
  ip_address VARCHAR(50)
);

CREATE INDEX IF NOT EXISTS idx_links_user_id ON links(user_id);
CREATE INDEX IF NOT EXISTS idx_links_short_code ON links(short_code);
CREATE INDEX IF NOT EXISTS idx_analytics_link_id ON analytics(link_id);

ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE links DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics DISABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION get_daily_stats(link_uuid UUID)
RETURNS TABLE (date TEXT, clicks BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    TO_CHAR(timestamp, 'YYYY-MM-DD') as date,
    COUNT(*)::BIGINT as clicks
  FROM analytics
  WHERE link_id = link_uuid
  GROUP BY TO_CHAR(timestamp, 'YYYY-MM-DD')
  ORDER BY date DESC
  LIMIT 30;
END;
$$ LANGUAGE plpgsql;
```

### Issue: Port 5000 already in use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**

```bash
# Kill process on port 5000
kill -9 $(lsof -ti:5000)

# Or change port in .env
PORT=5001
```

### Issue: Frontend not loading

**Error:**
```
sh: vite: command not found
```

**Solution:**

```bash
cd client
npm install
cd ..
npm run dev
```

---

## 📊 Verify Database Tables

Check if tables exist in Supabase:

1. Go to **Table Editor** in Supabase Dashboard
2. You should see 3 tables:
   - `users`
   - `links`
   - `analytics`

If tables are missing, run the SQL schema again.

---

## 🔐 Security Notes

### For Development:
- ✅ Use `SUPABASE_ANON_KEY` with RLS disabled
- ✅ Use `SUPABASE_SERVICE_KEY` with RLS enabled

### For Production:
- ⚠️ **NEVER** expose `SUPABASE_SERVICE_KEY` in frontend
- ⚠️ Always enable RLS in production
- ⚠️ Set up proper RLS policies

---

## 📞 Still Having Issues?

### Check Browser Console

1. Open DevTools (F12)
2. Go to Console tab
3. Look for error messages
4. Check Network tab for failed requests

### Check Server Logs

Look at terminal where `npm run dev` is running for error messages.

### Verify Environment Variables

```bash
# Check if .env file exists
ls -la .env

# View .env content (be careful not to share publicly!)
cat .env
```

---

## ✅ Success Checklist

- [ ] SQL schema created in Supabase
- [ ] RLS disabled OR service role key added
- [ ] `.env` file created with correct values
- [ ] `SUPABASE_URL` matches your project
- [ ] Dependencies installed (`npm install` in root and client)
- [ ] Server starts without errors
- [ ] Can register a new user
- [ ] Can create QR codes
- [ ] Can view dashboard

---

## 🎯 Quick Test Commands

```bash
# Test backend health
curl http://localhost:5000/api/health

# Test registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"123456"}'

# Check if frontend is running
curl http://localhost:5173
```

If all tests pass, your app is working correctly! 🎉
