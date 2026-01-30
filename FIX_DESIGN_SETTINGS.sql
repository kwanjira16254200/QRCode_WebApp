-- Fix Design Settings in Supabase
-- Run this in Supabase SQL Editor

-- Step 1: Check if design_settings column exists
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'links' AND column_name = 'design_settings';

-- Step 2: Add design_settings column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'links' AND column_name = 'design_settings'
    ) THEN
        ALTER TABLE links 
        ADD COLUMN design_settings JSONB 
        DEFAULT '{"frame": "none", "dotStyle": "square", "cornerStyle": "square", "fgColor": "#000000", "bgColor": "#ffffff", "logo": null}'::jsonb;
        RAISE NOTICE 'Added design_settings column';
    ELSE
        RAISE NOTICE 'design_settings column already exists';
    END IF;
END $$;

-- Step 3: Update existing rows that have NULL design_settings
UPDATE links
SET design_settings = '{"frame": "none", "dotStyle": "square", "cornerStyle": "square", "fgColor": "#000000", "bgColor": "#ffffff", "logo": null}'::jsonb
WHERE design_settings IS NULL;

-- Step 4: Verify all links have design_settings
SELECT 
    id,
    title,
    short_code,
    design_settings IS NOT NULL as has_design_settings,
    design_settings
FROM links
ORDER BY created_at DESC
LIMIT 10;

-- Step 5: Count how many links were updated
SELECT 
    COUNT(*) FILTER (WHERE design_settings IS NOT NULL) as with_design,
    COUNT(*) FILTER (WHERE design_settings IS NULL) as without_design,
    COUNT(*) as total
FROM links;
