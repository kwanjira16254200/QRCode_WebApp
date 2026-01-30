# Verify Design Settings in Supabase

## Issue
QR codes show different designs in Preview/Download vs Dashboard

## Root Cause Analysis

The code is already correct:
1. ✅ QRCodePage saves `designSettings` to database (line 178)
2. ✅ Backend stores `design_settings` in database (linkController.js line 33)
3. ✅ Dashboard uses `useQRCode` hook with `link.designSettings` (Dashboard.jsx line 243-246)

## Possible Issues

### 1. Database Column Missing
The `design_settings` column might not exist in your Supabase `links` table.

**Solution:** Run this SQL in Supabase SQL Editor:

```sql
-- Check if column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'links' AND column_name = 'design_settings';

-- If column doesn't exist, add it
ALTER TABLE links 
ADD COLUMN IF NOT EXISTS design_settings JSONB 
DEFAULT '{"frame": "none", "dotStyle": "square", "cornerStyle": "square", "fgColor": "#000000", "bgColor": "#ffffff", "logo": null}'::jsonb;

-- Update existing rows with default design
UPDATE links 
SET design_settings = '{"frame": "none", "dotStyle": "square", "cornerStyle": "square", "fgColor": "#000000", "bgColor": "#ffffff", "logo": null}'::jsonb
WHERE design_settings IS NULL;

-- Verify
SELECT id, title, design_settings 
FROM links 
ORDER BY created_at DESC 
LIMIT 5;
```

### 2. Old QR Codes Without Design Settings
Existing QR codes created before design settings feature might have NULL values.

**Solution:** The SQL above will fix this.

### 3. Case Sensitivity Issue
Backend uses `design_settings` (snake_case) but frontend might expect `designSettings` (camelCase).

**Check:** The backend controller already converts this correctly (line 64, 96, 131, 195 in linkController.js)

## Testing Steps

1. **Create New QR Code:**
   - Go to https://qrcode-webapp.web.app
   - Create new QR Code with custom design (colors, frame, etc.)
   - Save it
   - Check Dashboard - should show same design

2. **Check Database:**
   - Go to Supabase → Table Editor → links
   - Find the newly created QR code
   - Check `design_settings` column - should contain JSON with your design

3. **Check Console:**
   - Open browser DevTools → Console
   - Go to Dashboard
   - Look for logs: "Links fetched: X" and design settings for each link
   - Should show `hasDesignSettings: true` and the design object

## Quick Fix

If design settings are not showing in Dashboard:

1. **Hard reload:** Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
2. **Clear cache and reload**
3. **Check if design_settings column exists in Supabase**
4. **Create a NEW QR code** (old ones might not have design settings)

## Expected Behavior

All three locations should show identical QR codes:
- ✅ Preview page (during creation)
- ✅ Download page (step 4)
- ✅ Dashboard (after save)

The QR code should have:
- Same colors (foreground/background)
- Same dot style (square/rounded/dots)
- Same corner style (square/rounded/extra-rounded)
- Same frame (none/square/rounded/circle)
- Same logo (if added)
