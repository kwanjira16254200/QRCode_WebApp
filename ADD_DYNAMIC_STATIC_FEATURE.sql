-- เพิ่มฟีเจอร์ Dynamic/Static QR Code
-- รัน SQL นี้ใน Supabase SQL Editor

-- เพิ่มคอลัมน์ is_dynamic ในตาราง links
ALTER TABLE links ADD COLUMN IF NOT EXISTS is_dynamic BOOLEAN DEFAULT true;

-- อัปเดตข้อมูลเก่าให้เป็น dynamic ทั้งหมด
UPDATE links SET is_dynamic = true WHERE is_dynamic IS NULL;

-- ตรวจสอบผลลัพธ์
SELECT id, title, is_dynamic, is_active FROM links;
