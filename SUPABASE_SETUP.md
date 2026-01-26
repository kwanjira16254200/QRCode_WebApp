# 🗄️ Supabase Database Setup Guide

## 1. สร้าง Supabase Project

1. ไปที่ https://supabase.com
2. คลิก "Start your project"
3. สร้าง Organization (ถ้ายังไม่มี)
4. คลิก "New Project"
5. กรอกข้อมูล:
   - **Name**: qr-code-app (หรือชื่อที่ต้องการ)
   - **Database Password**: สร้างรหัสผ่านที่แข็งแรง (เก็บไว้ดี!)
   - **Region**: เลือก Southeast Asia (Singapore) - ใกล้ที่สุด
   - **Pricing Plan**: Free (เพียงพอสำหรับเริ่มต้น)
6. คลิก "Create new project"
7. รอประมาณ 2-3 นาทีให้ project พร้อมใช้งาน

## 2. รัน SQL Schema

1. ใน Supabase Dashboard ไปที่ **SQL Editor** (เมนูด้านซ้าย)
2. คลิก **"New query"**
3. คัดลอกโค้ด SQL ด้านล่างนี้ทั้งหมดแล้ววางลงไป:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create links table
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

-- Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID NOT NULL REFERENCES links(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  referer TEXT,
  ip_address VARCHAR(50),
  country VARCHAR(100),
  device VARCHAR(100)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_links_user_id ON links(user_id);
CREATE INDEX IF NOT EXISTS idx_links_short_code ON links(short_code);
CREATE INDEX IF NOT EXISTS idx_analytics_link_id ON analytics(link_id);
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics(timestamp);

-- Create function for daily stats
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

4. คลิก **"Run"** (หรือกด Ctrl+Enter / Cmd+Enter)
5. ถ้าสำเร็จจะเห็นข้อความ "Success. No rows returned"

## 3. ปิด Row Level Security (RLS) สำหรับ Development

**สำคัญ:** สำหรับ development เราจะปิด RLS ก่อน เพื่อให้ทำงานง่ายขึ้น

รัน SQL นี้ใน SQL Editor:

```sql
-- Disable RLS for development
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE links DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics DISABLE ROW LEVEL SECURITY;
```

**หมายเหตุ:** สำหรับ Production ควรเปิด RLS และตั้งค่า Policies ให้เหมาะสม

## 4. ดึง API Keys

1. ไปที่ **Settings** → **API** (เมนูด้านซ้าย)
2. คัดลอกข้อมูลเหล่านี้:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (ยาวมาก)

## 5. ตั้งค่า Environment Variables

สร้างไฟล์ `.env` ในโฟลเดอร์หลักของโปรเจค:

```bash
cp .env.example .env
```

แก้ไขไฟล์ `.env` ให้เป็นดังนี้:

```env
PORT=5000
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-key-here
JWT_SECRET=your-super-secret-jwt-key-12345
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**แทนที่:**
- `SUPABASE_URL`: ใส่ Project URL ของคุณ
- `SUPABASE_ANON_KEY`: ใส่ anon public key ของคุณ
- `JWT_SECRET`: สร้าง secret key ของคุณเอง (อย่างน้อย 32 ตัวอักษร)

## 6. ทดสอบการเชื่อมต่อ

รันเซิร์ฟเวอร์:

```bash
npm run dev
```

ถ้าเห็นข้อความนี้แสดงว่าสำเร็จ:
```
✅ Supabase connected
🚀 Server running on port 5000
📡 Client URL: http://localhost:5173
```

## 7. ตรวจสอบข้อมูลใน Supabase

1. ไปที่ **Table Editor** ใน Supabase Dashboard
2. คุณจะเห็นตาราง 3 ตาราง:
   - `users` - เก็บข้อมูลผู้ใช้
   - `links` - เก็บ QR Code links
   - `analytics` - เก็บสถิติการคลิก

## 🎉 เสร็จสิ้น!

ตอนนี้ฐานข้อมูล Supabase พร้อมใช้งานแล้ว!

## 📊 ข้อมูลเพิ่มเติม

### ตรวจสอบข้อมูลในตาราง

ใช้ SQL Editor รัน query:

```sql
-- ดูผู้ใช้ทั้งหมด
SELECT * FROM users;

-- ดู Links ทั้งหมด
SELECT * FROM links;

-- ดูสถิติ
SELECT * FROM analytics ORDER BY timestamp DESC LIMIT 10;
```

### ลบข้อมูลทั้งหมด (ระวัง!)

```sql
TRUNCATE TABLE analytics CASCADE;
TRUNCATE TABLE links CASCADE;
TRUNCATE TABLE users CASCADE;
```

### เปิด RLS สำหรับ Production

เมื่อพร้อม deploy production ให้รัน:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Create policies (ตัวอย่าง)
CREATE POLICY "Users can view own links" ON links
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own links" ON links
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
```

## 🔧 Troubleshooting

### ❌ "relation does not exist"
- ตรวจสอบว่ารัน SQL schema แล้ว
- ลองรัน SQL ใหม่อีกครั้ง

### ❌ "Invalid API key"
- ตรวจสอบว่าคัดลอก SUPABASE_ANON_KEY ถูกต้อง
- ตรวจสอบว่าไม่มีช่องว่างหรือขึ้นบรรทัดใหม่

### ❌ "Failed to fetch"
- ตรวจสอบว่า SUPABASE_URL ถูกต้อง
- ตรวจสอบว่า internet connection ทำงานปกติ

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
