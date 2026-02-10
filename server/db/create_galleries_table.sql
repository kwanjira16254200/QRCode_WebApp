-- Create galleries table for storing multiple images
CREATE TABLE IF NOT EXISTS galleries (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_galleries_user_id ON galleries(user_id);
CREATE INDEX IF NOT EXISTS idx_galleries_created_at ON galleries(created_at);

-- Add comment
COMMENT ON TABLE galleries IS 'Stores image galleries for QR codes with multiple images';
COMMENT ON COLUMN galleries.images IS 'Array of image URLs stored as JSONB';
