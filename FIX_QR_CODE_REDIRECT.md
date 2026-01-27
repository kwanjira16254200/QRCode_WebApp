# 🔧 แก้ไข QR Code Redirect - Page Not Found

## 🔴 ปัญหา

เมื่อ scan QR Code หรือเปิด Short URL:
```
https://qrcode-webapp.web.app/r/EiZzEPPZ
```

ได้ **"Page Not Found"** แทนที่จะ redirect ไปยัง website ที่ตั้งไว้

## 💡 สาเหตุ

**Backend ยังไม่ได้ deploy!**

- Frontend อยู่ที่: `https://qrcode-webapp.web.app` ✅
- Backend ยังไม่มี ❌
- เมื่อเปิด `/r/EiZzEPPZ` → ไม่มี backend ที่จะดึงข้อมูลจาก database และ redirect
- เลยเจอ 404 Page Not Found

## ✅ วิธีแก้ (ด่วน!)

### ขั้นตอนที่ 1: Deploy Backend บน Vercel (5 นาที)

1. **ไปที่** https://vercel.com
2. **Sign up with GitHub**
3. **Import Project:**
   - คลิก "Add New..." → "Project"
   - เลือก repository: `QRCode_WebApp`
   - คลิก "Import"

4. **ตั้งค่า:**
   - Framework: **Other**
   - Root Directory: ปล่อยว่าง

5. **เพิ่ม Environment Variables (7 ตัว):**

```
PORT = 5000
```
```
SUPABASE_URL = https://pnozpuxxqcbnijragick.supabase.co
```
```
SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBub3pwdXh4cWNibmlqcmFnaWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0MjAzODYsImV4cCI6MjA4NDk5NjM4Nn0.kv5pH0fBCAWrrmWE3Vq6yudIVT-96R-hDdqfBTC_yzc
```
```
SUPABASE_SERVICE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBub3pwdXh4cWNibmlqcmFnaWNrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTQyMDM4NiwiZXhwIjoyMDg0OTk2Mzg2fQ.VfmK2Q7ZhwwrltrfMxmuQvsqD-WVVjy0VDuijiNdxTQ
```
```
JWT_SECRET = fdb7f831-5db3-463e-9f33-277ba0781d07
```
```
NODE_ENV = production
```
```
CLIENT_URL = https://qrcode-webapp.web.app
```

6. **Deploy!**
   - คลิก "Deploy"
   - รอ 1-2 นาที
   - **คัดลอก URL** (เช่น `https://qrcode-webapp.vercel.app`)

---

### ขั้นตอนที่ 2: บอก URL ให้ผม

เมื่อได้ URL จาก Vercel แล้ว บอกผมว่า:
```
URL คือ: https://your-app.vercel.app
```

ผมจะ:
1. แก้ไข `.env.production`
2. Build frontend ใหม่
3. Deploy ใหม่

---

### ขั้นตอนที่ 3: ทดสอบ QR Code

หลัง deploy เสร็จ:
1. เปิด `https://qrcode-webapp.web.app/r/EiZzEPPZ`
2. ควร redirect ไปยัง `https://www.in01.co.th` (หรือ URL ที่ตั้งไว้)
3. ไม่เจอ Page Not Found อีกต่อไป! ✅

---

## 🎯 สรุป

**ต้อง deploy backend ก่อน** QR Code ถึงจะทำงาน!

เริ่มได้เลยที่: https://vercel.com 🚀
