# Gallery Feature Setup Instructions

## Overview
This guide will help you set up the Gallery feature for QR codes with multiple images.

## Step 1: Create Supabase Storage Bucket

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Navigate to **Storage** in the left sidebar
4. Click **New bucket**
5. Configure the bucket:
   - **Name**: `qr-images`
   - **Public bucket**: ✅ Check this (images need to be publicly accessible)
   - Click **Create bucket**

### Set Bucket Policies (Important!)

After creating the bucket, you need to set up policies:

1. Click on the `qr-images` bucket
2. Go to **Policies** tab
3. Click **New Policy**
4. Add the following policies:

#### Policy 1: Allow Public Read
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'qr-images' );
```

#### Policy 2: Allow Authenticated Upload
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'qr-images' 
  AND auth.role() = 'authenticated'
);
```

#### Policy 3: Allow Users to Delete Their Own Images
```sql
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'qr-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## Step 2: Create Galleries Table

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New query**
3. Copy and paste the contents from: `server/db/create_galleries_table.sql`
4. Click **Run** to execute the SQL

Or run this SQL directly:

```sql
-- Create galleries table for storing multiple images
CREATE TABLE IF NOT EXISTS galleries (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_galleries_user_id ON galleries(user_id);
CREATE INDEX IF NOT EXISTS idx_galleries_created_at ON galleries(created_at);

-- Add comments
COMMENT ON TABLE galleries IS 'Stores image galleries for QR codes with multiple images';
COMMENT ON COLUMN galleries.images IS 'Array of image URLs stored as JSONB';
```

## Step 3: Add Environment Variables (REQUIRED!)

**⚠️ IMPORTANT:** You MUST add Supabase credentials to your client environment files, otherwise image upload will fail with "supabaseUrl is required" error.

### Get Your Supabase Credentials

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Go to **Settings** → **API**
4. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public key** (starts with `eyJhbGci...`)

### Client Environment Files

You need to add Supabase credentials to BOTH files:

#### `/client/.env.development`
```env
# Development Environment Variables
VITE_API_URL=http://localhost:5000

# Supabase Configuration (Required for Gallery feature)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

#### `/client/.env.production`
```env
# Production Environment Variables
VITE_API_URL=https://your-backend-url.vercel.app

# Supabase Configuration (Required for Gallery feature)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

**Replace:**
- `your-project-id.supabase.co` with your actual Supabase Project URL
- `your-supabase-anon-key-here` with your actual anon public key

### Server Environment (if using server-side operations)
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

## Step 4: Install Dependencies (if needed)

The required packages should already be installed:
- `@supabase/supabase-js` - Supabase client
- `nanoid` - For generating unique IDs

If not installed, run:
```bash
cd client && npm install @supabase/supabase-js
cd ../server && npm install @supabase/supabase-js nanoid
```

## Step 5: Test the Feature

1. **Start the server**:
   ```bash
   cd server
   npm run dev
   ```

2. **Start the client**:
   ```bash
   cd client
   npm run dev
   ```

3. **Test the flow**:
   - Go to QR Generator
   - Select **Image** type
   - Upload 2-7 images (max 7)
   - Fill in QR Code Name
   - Click Next → Customize (optional) → Save
   - The QR code will point to `/gallery/:id`
   - Scan the QR code or visit the gallery URL
   - You should see all images in a responsive grid
   - Click any image to open lightbox (full screen view)

## Features

### Gallery Page Features:
- ✅ Responsive grid layout (1-4 columns based on screen size)
- ✅ Lightbox with full-screen image view
- ✅ Keyboard navigation (Arrow keys, Escape)
- ✅ Image counter (e.g., "3 / 7")
- ✅ Smooth transitions and hover effects
- ✅ Mobile-friendly

### Upload Features:
- ✅ Multiple file selection
- ✅ Image preview before upload
- ✅ Remove individual images
- ✅ Max 7 images per gallery
- ✅ File size validation (5MB per image)
- ✅ Automatic upload to Supabase Storage

## File Structure

```
client/src/
├── config/
│   └── supabase.js              # Supabase client config
├── utils/
│   └── supabaseStorage.js       # Upload/delete functions
├── pages/
│   └── Gallery.jsx              # Gallery display page
└── components/qr-generator/
    └── ContentForm.jsx          # Updated with file upload

server/
├── controllers/
│   └── galleryController.js     # Gallery CRUD operations
├── routes/
│   └── galleryRoutes.js         # Gallery API routes
└── db/
    └── create_galleries_table.sql

api/
└── /galleries
    ├── POST /                   # Create gallery (authenticated)
    ├── GET /:id                 # Get gallery (public)
    ├── GET /user/all           # Get user galleries (authenticated)
    └── DELETE /:id             # Delete gallery (authenticated)
```

## API Endpoints

### Create Gallery
```
POST /api/galleries
Headers: Authorization: Bearer <token>
Body: {
  "title": "My Gallery",
  "images": ["url1", "url2", "url3"]
}
```

### Get Gallery (Public)
```
GET /api/galleries/:id
No authentication required
```

### Get User Galleries
```
GET /api/galleries/user/all
Headers: Authorization: Bearer <token>
```

### Delete Gallery
```
DELETE /api/galleries/:id
Headers: Authorization: Bearer <token>
```

## Troubleshooting

### Images not uploading
- Check Supabase Storage bucket exists and is public
- Verify bucket policies are set correctly
- Check browser console for errors
- Ensure file size is under 5MB

### Gallery not found
- Verify the gallery was created in the database
- Check the gallery ID in the URL
- Ensure the galleries table exists

### CORS errors
- Check that your client URL is in the allowed origins in `server/index.js`
- Verify Supabase URL and keys are correct

## Next Steps

1. ✅ Complete Supabase Storage setup
2. ✅ Create galleries table
3. ✅ Test image upload
4. ✅ Test gallery display
5. ✅ Test QR code generation
6. ✅ Deploy to production

## Production Deployment

Before deploying:
1. Ensure all environment variables are set in production
2. Verify Supabase bucket is public
3. Test gallery URLs are accessible
4. Check QR codes point to correct production URLs
