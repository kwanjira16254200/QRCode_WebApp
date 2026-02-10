-- Update existing links with default values for new columns
-- This ensures old QR codes will work with the new system

UPDATE links
SET 
  is_dynamic = COALESCE(is_dynamic, true),
  qr_type = COALESCE(qr_type, 'url'),
  content = COALESCE(content, jsonb_build_object('url', original_url, 'name', title)),
  design_settings = COALESCE(design_settings, '{"frame": "none", "pattern": "square", "fgColor": "#000000", "bgColor": "#ffffff", "logo": null}'::jsonb)
WHERE 
  content IS NULL OR design_settings IS NULL OR qr_type IS NULL OR is_dynamic IS NULL;

-- Verify the update
SELECT 
  id, 
  title, 
  short_code, 
  is_dynamic, 
  qr_type, 
  content IS NOT NULL as has_content,
  design_settings IS NOT NULL as has_design
FROM links
ORDER BY created_at DESC
LIMIT 10;
