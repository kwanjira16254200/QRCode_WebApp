-- Add qr_type column to links table
ALTER TABLE links ADD COLUMN IF NOT EXISTS qr_type VARCHAR(20) DEFAULT 'url';

-- Update existing records to have 'url' as default type
UPDATE links SET qr_type = 'url' WHERE qr_type IS NULL;

-- Add comment to column
COMMENT ON COLUMN links.qr_type IS 'Type of QR code: url, text, or image';
