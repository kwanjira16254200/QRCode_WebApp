-- ⚠️ IMPORTANT: รัน SQL นี้ใน Supabase SQL Editor ก่อนสร้าง QR Code ใหม่
-- This SQL adds the design_settings column to store QR code design customization

-- Step 1: Add design_settings column if it doesn't exist
ALTER TABLE links 
ADD COLUMN IF NOT EXISTS design_settings JSONB 
DEFAULT '{"frame": "none", "dotStyle": "square", "cornerStyle": "square", "fgColor": "#000000", "bgColor": "#ffffff", "logo": null}'::jsonb;

-- Step 2: Update existing rows that have NULL design_settings
UPDATE links
SET design_settings = '{"frame": "none", "dotStyle": "square", "cornerStyle": "square", "fgColor": "#000000", "bgColor": "#ffffff", "logo": null}'::jsonb
WHERE design_settings IS NULL;

-- Step 3: Verify the column was added and data was updated
SELECT 
    id,
    title,
    short_code,
    design_settings IS NOT NULL as has_design,
    design_settings
FROM links 
ORDER BY created_at DESC 
LIMIT 5;

-- Expected result: All rows should have has_design = true and design_settings with JSON data
