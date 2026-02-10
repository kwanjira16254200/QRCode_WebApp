# 🗄️ Setup Supabase Storage for Image Gallery

## ✅ สิ่งที่ต้องทำ:

### **Step 1: Get Supabase Credentials**

1. ไปที่ https://app.supabase.com
2. เลือก project ของคุณ (หรือสร้างใหม่ถ้ายังไม่มี)
3. ไปที่ **Settings** → **API**
4. Copy ข้อมูล 2 ตัวนี้:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (ยาวมาก)

---

### **Step 2: Add Credentials to Environment Files**

#### **File: `/client/.env.development`**
```env
# Development Environment Variables
VITE_API_URL=http://localhost:5000

# Supabase Configuration (Required for Gallery feature)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### **File: `/client/.env.production`**
```env
# Production Environment Variables
VITE_API_URL=https://qr-code-web-33iwisc9p-qr-code-web-apps-projects.vercel.app

# Supabase Configuration (Required for Gallery feature)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ แทนที่:**
- `https://xxxxx.supabase.co` → Project URL ของคุณ
- `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` → anon public key ของคุณ

---

### **Step 3: Create Storage Bucket**

1. ใน Supabase Dashboard ไปที่ **Storage** (เมนูด้านซ้าย)
2. คลิก **New bucket**
3. ตั้งค่า:
   - **Name**: `qr-images`
   - **Public bucket**: ✅ **เปิด** (สำคัญ!)
   - คลิก **Create bucket**

---

### **Step 4: Set Bucket Policies**

หลังจากสร้าง bucket แล้ว ต้องตั้งค่า policies:

1. คลิกที่ bucket `qr-images`
2. ไปที่ **Policies** tab
3. คลิก **New Policy**
4. เพิ่ม 3 policies นี้:

#### **Policy 1: Public Read (ให้ทุกคนดูรูปได้)**
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'qr-images' );
```

#### **Policy 2: Authenticated Upload (ให้ user ที่ login แล้วอัปโหลดได้)**
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'qr-images' 
  AND auth.role() = 'authenticated'
);
```

#### **Policy 3: Delete Own Images (ให้ user ลบรูปของตัวเองได้)**
```sql
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'qr-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

---

### **Step 5: Create Galleries Table**

ไปที่ **SQL Editor** ใน Supabase Dashboard แล้วรัน SQL นี้:

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

---

### **Step 6: Rebuild and Deploy**

หลังจากเพิ่ม credentials แล้ว:

```bash
cd client
npm run build
firebase deploy --only hosting
```

---

## 🎯 Features:

### **Upload Images:**
- ✅ อัปโหลดได้ไม่จำกัดจำนวนรูป
- ✅ รวมกันไม่เกิน **10MB** ต่อ 1 QR Code
- ✅ แสดง progress bar และขนาดไฟล์
- ✅ Preview รูปก่อนอัปโหลด

### **Gallery:**
- ✅ รูปเดียว → QR Code ชี้ตรงไปที่รูป
- ✅ หลายรูป → สร้าง Gallery page
- ✅ Responsive grid layout
- ✅ Lightbox (full screen view)
- ✅ Keyboard navigation

---

## 🧪 ทดสอบ:

1. ไปที่ https://qrcode-webapp.web.app
2. Hard reload: `Cmd + Shift + R`
3. Login
4. สร้าง QR Code → เลือก **Image**
5. อัปโหลดรูป 2-3 รูป
6. ✅ ควรเห็น progress bar และ preview
7. Save QR Code
8. ✅ ควร save สำเร็จ
9. Scan QR Code
10. ✅ ควรเห็น Gallery

---

## ⚠️ Troubleshooting:

### **Error: "supabaseUrl is required"**
- ตรวจสอบว่าเพิ่ม `VITE_SUPABASE_URL` และ `VITE_SUPABASE_ANON_KEY` ใน `.env` files แล้ว
- Rebuild: `npm run build`
- Deploy: `firebase deploy --only hosting`

### **Error: "Failed to upload"**
- ตรวจสอบว่าสร้าง bucket `qr-images` แล้ว
- ตรวจสอบว่า bucket เป็น **Public**
- ตรวจสอบว่าตั้งค่า policies ครบ 3 policies

### **Gallery not found**
- ตรวจสอบว่าสร้าง `galleries` table แล้ว
- ตรวจสอบว่า backend มี gallery routes (deploy backend ด้วย)

---

## 📚 คล้ายกับ:

เว็บ **online-qr-generator.com**:
- ✅ อัปโหลดรูปจากเครื่อง
- ✅ ไม่จำกัดจำนวนรูป (แต่จำกัดขนาด 10MB)
- ✅ สร้าง Gallery อัตโนมัติ
- ✅ QR Code ชี้ไปที่ Gallery

---

## 🎉 เสร็จแล้ว!

ตอนนี้คุณสามารถ:
- อัปโหลดรูปจากเครื่องตัวเอง
- สร้าง Gallery สวยๆ
- แชร์ผ่าน QR Code

**ลองทดสอบแล้วบอกผลได้เลยครับ!** 🚀
