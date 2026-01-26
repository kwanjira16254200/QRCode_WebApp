-- คัดลอก SQL นี้ทั้งหมดและรันใน Supabase SQL Editor
-- ไปที่: Supabase Dashboard → SQL Editor → New Query → วาง SQL นี้ → Run

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

-- ⚠️ สำคัญ: ปิด RLS เพื่อให้ทำงานได้
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

-- เสร็จแล้ว! ตรวจสอบว่าสำเร็จโดยไปที่ Table Editor
-- คุณควรเห็นตาราง: users, links, analytics
