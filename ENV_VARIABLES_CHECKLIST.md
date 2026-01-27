# 📋 Environment Variables Checklist

## สำหรับ Deploy บน Render.com

เมื่อคุณ deploy backend ไปที่ Render.com ให้เพิ่ม Environment Variables ทั้งหมดนี้:

---

## ✅ ตัวแปรที่ต้องตั้งค่า (ทั้งหมด 7 ตัว)

### 1. PORT
```
PORT
```
**Value:**
```
5000
```

---

### 2. SUPABASE_URL
```
SUPABASE_URL
```
**Value:**
```
https://pnozpuxxqcbnijragick.supabase.co
```

---

### 3. SUPABASE_ANON_KEY
```
SUPABASE_ANON_KEY
```
**Value:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBub3pwdXh4cWNibmlqcmFnaWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0MjAzODYsImV4cCI6MjA4NDk5NjM4Nn0.kv5pH0fBCAWrrmWE3Vq6yudIVT-96R-hDdqfBTC_yzc
```

---

### 4. SUPABASE_SERVICE_KEY
```
SUPABASE_SERVICE_KEY
```
**Value:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBub3pwdXh4cWNibmlqcmFnaWNrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTQyMDM4NiwiZXhwIjoyMDg0OTk2Mzg2fQ.VfmK2Q7ZhwwrltrfMxmuQvsqD-WVVjy0VDuijiNdxTQ
```

---

### 5. JWT_SECRET
```
JWT_SECRET
```
**Value:**
```
fdb7f831-5db3-463e-9f33-277ba0781d07
```

---

### 6. NODE_ENV
```
NODE_ENV
```
**Value:**
```
production
```

---

### 7. CLIENT_URL
```
CLIENT_URL
```
**Value:**
```
https://qrcode-webapp.web.app
```

---

## 📝 วิธีเพิ่ม Environment Variables ใน Render

### ขั้นตอน:

1. ไปที่ Render Dashboard → เลือก Web Service ของคุณ
2. คลิกแท็บ **"Environment"** ทางซ้าย
3. คลิกปุ่ม **"Add Environment Variable"**
4. กรอก **Key** และ **Value** ตามด้านบน
5. คลิก **"Save Changes"**
6. ทำซ้ำสำหรับทั้ง 7 ตัวแปร

### หรือ:

1. ตอนสร้าง Web Service ใหม่
2. เลื่อนลงมาที่ส่วน **"Environment Variables"**
3. คลิก **"Add Environment Variable"** แล้วกรอกทีละตัว
4. กรอกครบทั้ง 7 ตัวก่อนคลิก **"Create Web Service"**

---

## ⚠️ สำคัญ!

- **อย่าลืม** ตั้งค่าครบทั้ง 7 ตัวแปร
- **อย่าเผยแพร่** ค่า SUPABASE_SERVICE_KEY และ JWT_SECRET ต่อสาธารณะ
- **ตรวจสอบ** ว่าไม่มีช่องว่างหน้า-หลังค่าที่คัดลอก
- **Copy-Paste** ตรงๆ จากไฟล์นี้เพื่อหลีกเลี่ยงข้อผิดพลาด

---

## 🔍 ตรวจสอบว่าตั้งค่าถูกต้อง

หลังจาก deploy แล้ว ทดสอบโดยเปิด:

```
https://YOUR-APP-NAME.onrender.com/api/health
```

ถ้าเห็น:
```json
{
  "status": "OK",
  "message": "Server is running",
  "database": "Supabase"
}
```

แสดงว่าตั้งค่าถูกต้อง ✅

ถ้าเจอ error แสดงว่า Environment Variables อาจตั้งผิด ❌

---

## 📱 หลังจากตั้งค่าเสร็จ

อย่าลืม:
1. Copy URL ของ Render (เช่น `https://qrcode-webapp-api.onrender.com`)
2. ไปแก้ไขไฟล์ `client/.env.production`:
   ```
   VITE_API_URL=https://qrcode-webapp-api.onrender.com
   ```
3. Build และ deploy frontend ใหม่:
   ```bash
   cd client
   npm run build
   firebase deploy
   ```

---

**เสร็จแล้ว! ระบบของคุณพร้อมใช้งาน 🎉**
