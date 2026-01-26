# ⚡ Quick Start Guide

## คุณมี Supabase API Key แล้ว!

API Key: `sb_publishable_94DcwDt23uj_OMq7iqI2Zg_zsN2fFbi`

## 🚀 เริ่มใช้งานด่วน (3 ขั้นตอน)

### ขั้นตอนที่ 1: ตั้งค่า Supabase Database

1. **ไปที่ Supabase Dashboard** ของคุณ
2. **เปิด SQL Editor** (เมนูด้านซ้าย)
3. **คัดลอกและรัน SQL นี้:**

```sql
-- Create tables
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
  ip_address VARCHAR(50),
  country VARCHAR(100),
  device VARCHAR(100)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_links_user_id ON links(user_id);
CREATE INDEX IF NOT EXISTS idx_links_short_code ON links(short_code);
CREATE INDEX IF NOT EXISTS idx_analytics_link_id ON analytics(link_id);
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics(timestamp);

-- Disable RLS for development
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE links DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics DISABLE ROW LEVEL SECURITY;

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

4. **คลิก Run** (Ctrl+Enter หรือ Cmd+Enter)

### ขั้นตอนที่ 2: ตั้งค่า Environment Variables

1. **ดึง Supabase URL:**
   - ไปที่ Settings → API
   - คัดลอก **Project URL** (เช่น `https://xxxxx.supabase.co`)

2. **สร้างไฟล์ `.env`:**

```bash
cp .env.local .env
```

3. **แก้ไขไฟล์ `.env`** - เปลี่ยนบรรทัดนี้:

```env
SUPABASE_URL=https://your-project.supabase.co
```

เป็น URL จริงของคุณ เช่น:

```env
SUPABASE_URL=https://abcdefghijk.supabase.co
```

**ไฟล์ `.env` ที่สมบูรณ์จะเป็น:**

```env
PORT=5000
SUPABASE_URL=https://your-actual-project-id.supabase.co
SUPABASE_ANON_KEY=sb_publishable_94DcwDt23uj_OMq7iqI2Zg_zsN2fFbi
JWT_SECRET=qr-code-dynamic-app-secret-key-2024-production-ready
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### ขั้นตอนที่ 3: รันแอปพลิเคชัน

```bash
npm run dev
```

**เปิดเบราว์เซอร์:** http://localhost:5173

## ✅ ทดสอบการทำงาน

1. **สมัครสมาชิก:**
   - ชื่อ: Test User
   - อีเมล: test@example.com
   - รหัสผ่าน: 123456

2. **สร้าง QR Code:**
   - ชื่อ: My Website
   - URL: https://google.com

3. **ทดสอบ QR Code:**
   - สแกน QR หรือคลิก "ทดสอบลิงก์"
   - ควร redirect ไปที่ Google

4. **ดูสถิติ:**
   - คลิก "สถิติ" เพื่อดูจำนวนการคลิก

## 🎯 คุณสมบัติ

- ✅ สร้าง Dynamic QR Code
- ✅ Short Link อัตโนมัติ (เช่น `/r/AbCd1234`)
- ✅ แก้ไข URL ได้ทุกเมื่อ (Dynamic!)
- ✅ ติดตามสถิติการสแกน
- ✅ กราฟแสดงสถิติรายวัน
- ✅ ดาวน์โหลด QR Code เป็น PNG
- ✅ เปิด/ปิดใช้งาน QR Code

## 🐛 แก้ปัญหา

### Port 5000 ถูกใช้งานอยู่

```bash
# หา process ที่ใช้ port 5000
lsof -ti:5000

# ปิด process
kill -9 $(lsof -ti:5000)

# หรือเปลี่ยน PORT ในไฟล์ .env
PORT=5001
```

### ❌ Supabase connection error

1. ตรวจสอบ `SUPABASE_URL` ว่าถูกต้อง
2. ตรวจสอบ `SUPABASE_ANON_KEY` ว่าไม่มีช่องว่าง
3. ตรวจสอบว่ารัน SQL schema แล้ว

### ❌ Frontend ไม่ทำงาน

```bash
cd client
npm install
cd ..
npm run dev
```

## 📚 เอกสารเพิ่มเติม

- `README.md` - ข้อมูลโปรเจคทั่วไป
- `SETUP.md` - คู่มือติดตั้งแบบละเอียด
- `SUPABASE_SETUP.md` - คู่มือตั้งค่า Supabase แบบละเอียด

## 🎉 สนุกกับการสร้าง QR Code!
