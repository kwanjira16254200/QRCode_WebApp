-- Force add columns to links table with explicit checks
-- Run this in Supabase SQL Editor

-- First, check if columns exist and add them one by one
DO $$ 
BEGIN
    -- Add is_dynamic column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'links' AND column_name = 'is_dynamic'
    ) THEN
        ALTER TABLE links ADD COLUMN is_dynamic BOOLEAN DEFAULT true;
        RAISE NOTICE 'Added is_dynamic column';
    ELSE
        RAISE NOTICE 'is_dynamic column already exists';
    END IF;

    -- Add qr_type column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'links' AND column_name = 'qr_type'
    ) THEN
        ALTER TABLE links ADD COLUMN qr_type VARCHAR(50) DEFAULT 'url';
        RAISE NOTICE 'Added qr_type column';
    ELSE
        RAISE NOTICE 'qr_type column already exists';
    END IF;

    -- Add content column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'links' AND column_name = 'content'
    ) THEN
        ALTER TABLE links ADD COLUMN content JSONB;
        RAISE NOTICE 'Added content column';
    ELSE
        RAISE NOTICE 'content column already exists';
    END IF;

    -- Add design_settings column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'links' AND column_name = 'design_settings'
    ) THEN
        ALTER TABLE links ADD COLUMN design_settings JSONB DEFAULT '{"frame": "none", "pattern": "square", "fgColor": "#000000", "bgColor": "#ffffff", "logo": null}'::jsonb;
        RAISE NOTICE 'Added design_settings column';
    ELSE
        RAISE NOTICE 'design_settings column already exists';
    END IF;
END $$;

-- Verify the columns were added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'links'
ORDER BY ordinal_position;
