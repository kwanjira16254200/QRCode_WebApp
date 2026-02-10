-- Create qr_codes table for the new multi-step QR generator
CREATE TABLE IF NOT EXISTS qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  qr_type TEXT NOT NULL CHECK (qr_type IN ('url', 'text', 'email', 'phone', 'sms', 'wifi', 'vcard', 'location')),
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  design_settings JSONB DEFAULT '{"frame": "none", "pattern": "square", "fgColor": "#000000", "bgColor": "#ffffff", "logo": null}'::jsonb,
  short_code TEXT UNIQUE NOT NULL,
  redirect_url TEXT NOT NULL,
  is_dynamic BOOLEAN DEFAULT true,
  scan_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create qr_scans table for analytics
CREATE TABLE IF NOT EXISTS qr_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_code_id UUID REFERENCES qr_codes(id) ON DELETE CASCADE,
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  ip_address TEXT,
  country TEXT,
  city TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_qr_codes_user_id ON qr_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_short_code ON qr_codes(short_code);
CREATE INDEX IF NOT EXISTS idx_qr_scans_qr_code_id ON qr_scans(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_qr_scans_scanned_at ON qr_scans(scanned_at);

-- Add comments
COMMENT ON TABLE qr_codes IS 'Stores QR codes created with the multi-step generator';
COMMENT ON TABLE qr_scans IS 'Tracks individual QR code scans for analytics';
