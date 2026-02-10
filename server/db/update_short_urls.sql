-- This SQL is NOT needed - short_code in database doesn't include the /r/ or /s/ prefix
-- The prefix is only added in the frontend when displaying the URL
-- So no database update is required

-- Just verify the data
SELECT id, title, short_code, original_url, qr_type
FROM links
ORDER BY created_at DESC
LIMIT 10;
