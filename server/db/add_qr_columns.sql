-- Add missing columns to existing links table for QR generator features
ALTER TABLE links 
ADD COLUMN IF NOT EXISTS is_dynamic BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS qr_type VARCHAR(50) DEFAULT 'url',
ADD COLUMN IF NOT EXISTS content JSONB,
ADD COLUMN IF NOT EXISTS design_settings JSONB DEFAULT '{"frame": "none", "pattern": "square", "fgColor": "#000000", "bgColor": "#ffffff", "logo": null}'::jsonb;
