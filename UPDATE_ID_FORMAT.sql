-- รัน SQL นี้ใน Supabase SQL Editor เพื่อเปลี่ยน ID Format
-- ⚠️ คำเตือน: จะลบข้อมูลเก่าทั้งหมด!

-- ลบตารางเก่า
DROP TABLE IF EXISTS analytics CASCADE;
DROP TABLE IF EXISTS links CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ลบ functions เก่า
DROP FUNCTION IF EXISTS get_daily_stats(UUID);
DROP FUNCTION IF EXISTS generate_user_id();
DROP FUNCTION IF EXISTS generate_link_id();
DROP FUNCTION IF EXISTS generate_scan_id();

-- สร้าง function สำหรับ generate ID แบบใหม่
CREATE OR REPLACE FUNCTION generate_user_id()
RETURNS TEXT AS $$
DECLARE
  new_id TEXT;
  id_exists BOOLEAN;
BEGIN
  LOOP
    -- สร้าง ID แบบ user-xxxxxx (6 ตัวอักษร random)
    new_id := 'user-' || lower(substring(md5(random()::text || clock_timestamp()::text) from 1 for 6));
    
    -- ตรวจสอบว่า ID ซ้ำหรือไม่
    SELECT EXISTS(SELECT 1 FROM users WHERE id = new_id) INTO id_exists;
    
    -- ถ้าไม่ซ้ำให้ออกจาก loop
    EXIT WHEN NOT id_exists;
  END LOOP;
  
  RETURN new_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_link_id()
RETURNS TEXT AS $$
DECLARE
  new_id TEXT;
  id_exists BOOLEAN;
BEGIN
  LOOP
    new_id := 'link-' || lower(substring(md5(random()::text || clock_timestamp()::text) from 1 for 6));
    SELECT EXISTS(SELECT 1 FROM links WHERE id = new_id) INTO id_exists;
    EXIT WHEN NOT id_exists;
  END LOOP;
  RETURN new_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_scan_id()
RETURNS TEXT AS $$
DECLARE
  new_id TEXT;
  id_exists BOOLEAN;
BEGIN
  LOOP
    new_id := 'scan-' || lower(substring(md5(random()::text || clock_timestamp()::text) from 1 for 6));
    SELECT EXISTS(SELECT 1 FROM analytics WHERE id = new_id) INTO id_exists;
    EXIT WHEN NOT id_exists;
  END LOOP;
  RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- สร้างตาราง users ใหม่
CREATE TABLE users (
  id TEXT PRIMARY KEY DEFAULT generate_user_id(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- สร้างตาราง links ใหม่
CREATE TABLE links (
  id TEXT PRIMARY KEY DEFAULT generate_link_id(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  original_url TEXT NOT NULL,
  short_code VARCHAR(50) UNIQUE NOT NULL,
  clicks INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- สร้างตาราง analytics ใหม่
CREATE TABLE analytics (
  id TEXT PRIMARY KEY DEFAULT generate_scan_id(),
  link_id TEXT NOT NULL REFERENCES links(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  referer TEXT,
  ip_address VARCHAR(50),
  country VARCHAR(100),
  device VARCHAR(100)
);

-- สร้าง indexes
CREATE INDEX idx_links_user_id ON links(user_id);
CREATE INDEX idx_links_short_code ON links(short_code);
CREATE INDEX idx_analytics_link_id ON analytics(link_id);
CREATE INDEX idx_analytics_timestamp ON analytics(timestamp);

-- ปิด RLS
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE links DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics DISABLE ROW LEVEL SECURITY;

-- สร้าง function สำหรับ daily stats (ใช้ TEXT แทน UUID)
CREATE OR REPLACE FUNCTION get_daily_stats(link_uuid TEXT)
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

-- ทดสอบ: สร้าง user ตัวอย่าง
-- INSERT INTO users (email, password, name) VALUES ('test@example.com', '$2a$10$test', 'Test User');

-- ตรวจสอบ ID ที่ถูกสร้าง
-- SELECT * FROM users;
