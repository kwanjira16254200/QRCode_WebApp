-- ========================================
-- ขั้นตอนที่ 1: ลบตารางเก่าทั้งหมด
-- ========================================
DROP TABLE IF EXISTS analytics CASCADE;
DROP TABLE IF EXISTS links CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ========================================
-- ขั้นตอนที่ 2: สร้าง Functions สำหรับ Generate ID
-- ========================================

-- Function สำหรับ User ID (user-xxxxxx)
CREATE OR REPLACE FUNCTION generate_user_id()
RETURNS TEXT AS $$
DECLARE
  new_id TEXT;
  id_exists BOOLEAN;
BEGIN
  LOOP
    new_id := 'user-' || lower(substring(md5(random()::text || clock_timestamp()::text) from 1 for 6));
    SELECT EXISTS(SELECT 1 FROM users WHERE id = new_id) INTO id_exists;
    EXIT WHEN NOT id_exists;
  END LOOP;
  RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Function สำหรับ Link ID (link-xxxxxx)
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

-- Function สำหรับ Analytics ID (scan-xxxxxx)
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

-- ========================================
-- ขั้นตอนที่ 3: สร้างตาราง Users
-- ========================================
CREATE TABLE users (
  id TEXT PRIMARY KEY DEFAULT generate_user_id(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- ขั้นตอนที่ 4: สร้างตาราง Links
-- ========================================
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

-- ========================================
-- ขั้นตอนที่ 5: สร้างตาราง Analytics
-- ========================================
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

-- ========================================
-- ขั้นตอนที่ 6: สร้าง Indexes
-- ========================================
CREATE INDEX idx_links_user_id ON links(user_id);
CREATE INDEX idx_links_short_code ON links(short_code);
CREATE INDEX idx_analytics_link_id ON analytics(link_id);
CREATE INDEX idx_analytics_timestamp ON analytics(timestamp);

-- ========================================
-- ขั้นตอนที่ 7: ปิด Row Level Security
-- ========================================
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE links DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics DISABLE ROW LEVEL SECURITY;

-- ========================================
-- ขั้นตอนที่ 8: สร้าง Function สำหรับ Analytics
-- ========================================
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

-- ========================================
-- เสร็จสิ้น! ทดสอบด้วยคำสั่งนี้:
-- ========================================
-- INSERT INTO users (email, password, name) VALUES ('test@test.com', '$2a$10$test', 'Test');
-- SELECT * FROM users;
-- คุณจะเห็น ID เป็น user-xxxxxx
