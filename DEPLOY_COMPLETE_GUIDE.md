# 🚀 คู่มือ Deploy ครบวงจร - Frontend + Backend + Database

## 📊 สถานะปัจจุบัน

| ส่วน | สถานะ | URL |
|------|-------|-----|
| **Frontend** | ✅ Deploy แล้ว | https://qrcode-webapp.web.app |
| **Backend** | ❌ ยังไม่ได้ deploy | รันแค่ localhost:5001 |
| **Database** | ✅ พร้อมใช้งาน | Supabase (cloud) |

## ⚠️ ปัญหาที่เจอ: 404 Error

**สาเหตุ:**
- Frontend บน Firebase พยายามเรียก API ไปที่ `http://localhost:5001`
- แต่ localhost ไม่มีอยู่บน internet → เลยเจอ 404

**วิธีแก้:**
- Deploy Backend ไปที่ Vercel (ฟรี, ง่าย, เร็ว)
- อัพเดท Frontend ให้ชี้ไป Backend URL ที่ deploy แล้ว

---

## 🎯 แผนการ Deploy (3 ขั้นตอนหลัก)

### ขั้นตอนที่ 1: เตรียม Code สำหรับ Deploy
### ขั้นตอนที่ 2: Deploy Backend ไปที่ Vercel
### ขั้นตอนที่ 3: อัพเดทและ Deploy Frontend ใหม่

---

# 📋 ขั้นตอนที่ 1: เตรียม Code สำหรับ Deploy

## 1.1 ตรวจสอบว่ามี Git Repository แล้วหรือยัง

```bash
cd /Users/kwanjirakakate/QR\ Code\ Web\ App
git status
```

**ถ้าเห็น:** `fatal: not a git repository`

**ให้ทำ:**
```bash
# สร้าง Git repository
git init

# เพิ่มไฟล์ทั้งหมด
git add .

# Commit
git commit -m "Ready for deployment"
```

**ถ้าเห็น:** `On branch main` หรือ `On branch master`

**แสดงว่า:** มี Git แล้ว ข้ามไปขั้นตอน 1.2

---

## 1.2 Push Code ขึ้น GitHub

### ถ้ายังไม่มี GitHub Repository:

1. ไปที่ https://github.com และ login
2. คลิก **"New repository"** (ปุ่มสีเขียว)
3. ตั้งชื่อ: `qrcode-webapp`
4. **อย่า** tick "Initialize with README"
5. คลิก **"Create repository"**

### Push Code ขึ้น GitHub:

```bash
# เชื่อมต่อกับ GitHub (แทนที่ YOUR_USERNAME ด้วยชื่อ GitHub ของคุณ)
git remote add origin https://github.com/YOUR_USERNAME/qrcode-webapp.git

# หรือถ้ามี remote อยู่แล้ว ให้ใช้
git remote set-url origin https://github.com/YOUR_USERNAME/qrcode-webapp.git

# Push code
git branch -M main
git push -u origin main
```

**ถ้าเจอ error:** `remote origin already exists`
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/qrcode-webapp.git
git push -u origin main
```

---

# 📋 ขั้นตอนที่ 2: Deploy Backend ไปที่ Vercel

## 2.1 สมัครและเข้าสู่ Vercel

1. ไปที่ https://vercel.com
2. คลิก **"Sign Up"**
3. เลือก **"Continue with GitHub"**
4. อนุญาตให้ Vercel เข้าถึง GitHub

---

## 2.2 Import Project

1. หลัง login แล้ว คลิก **"Add New..."** (มุมบนขวา)
2. เลือก **"Project"**
3. หา repository **"qrcode-webapp"** แล้วคลิก **"Import"**

**ถ้าไม่เห็น repository:**
- คลิก **"Adjust GitHub App Permissions"**
- เลือก repository ที่ต้องการ
- กลับมาหน้า Vercel แล้วลองใหม่

---

## 2.3 ตั้งค่า Project

### Framework Preset:
- เลือก **"Other"**

### Root Directory:
- ปล่อยว่าง (ใช้ root)

### Build Settings:
- **Build Command:** ปล่อยว่าง
- **Output Directory:** ปล่อยว่าง
- **Install Command:** `npm install`

---

## 2.4 เพิ่ม Environment Variables (สำคัญมาก!)

เลื่อนลงมาที่ **"Environment Variables"** แล้วเพิ่มทีละตัว:

### ตัวที่ 1: PORT
```
Key: PORT
Value: 5000
```

### ตัวที่ 2: SUPABASE_URL
```
Key: SUPABASE_URL
Value: https://pnozpuxxqcbnijragick.supabase.co
```

### ตัวที่ 3: SUPABASE_ANON_KEY
```
Key: SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBub3pwdXh4cWNibmlqcmFnaWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0MjAzODYsImV4cCI6MjA4NDk5NjM4Nn0.kv5pH0fBCAWrrmWE3Vq6yudIVT-96R-hDdqfBTC_yzc
```

### ตัวที่ 4: SUPABASE_SERVICE_KEY
```
Key: SUPABASE_SERVICE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBub3pwdXh4cWNibmlqcmFnaWNrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTQyMDM4NiwiZXhwIjoyMDg0OTk2Mzg2fQ.VfmK2Q7ZhwwrltrfMxmuQvsqD-WVVjy0VDuijiNdxTQ
```

### ตัวที่ 5: JWT_SECRET
```
Key: JWT_SECRET
Value: fdb7f831-5db3-463e-9f33-277ba0781d07
```

### ตัวที่ 6: NODE_ENV
```
Key: NODE_ENV
Value: production
```

### ตัวที่ 7: CLIENT_URL
```
Key: CLIENT_URL
Value: https://qrcode-webapp.web.app
```

**วิธีเพิ่ม:**
1. คลิก **"Add"** หรือ **"Add Environment Variable"**
2. ใส่ Key และ Value
3. ทำซ้ำสำหรับทั้ง 7 ตัว

---

## 2.5 Deploy!

1. ตรวจสอบว่าเพิ่ม Environment Variables ครบ 7 ตัว
2. คลิกปุ่ม **"Deploy"** สีน้ำเงิน
3. รอ 1-2 นาที

### ดู Deploy Logs:

คุณจะเห็น logs แสดงความคืบหน้า:
```
Building...
Installing dependencies...
Build completed
Deploying...
✓ Deployment ready
```

### เมื่อ Deploy สำเร็จ:

- จะเห็นหน้า **"Congratulations!"** 🎉
- คุณจะได้ URL เช่น: `https://qrcode-webapp.vercel.app`
- **คัดลอก URL นี้ไว้** - จะใช้ในขั้นตอนถัดไป

---

## 2.6 ทดสอบ Backend

เปิด browser ไปที่:
```
https://qrcode-webapp.vercel.app/api/health
```

**ถ้าเห็น:**
```json
{
  "status": "OK",
  "message": "Server is running",
  "database": "Supabase"
}
```

✅ **แสดงว่า Backend deploy สำเร็จ!**

**ถ้าเจอ error:**
- ตรวจสอบ Environment Variables ว่าครบ 7 ตัว
- ตรวจสอบว่าไม่มีช่องว่างหน้า-หลังค่า
- ดู logs ใน Vercel Dashboard

---

# 📋 ขั้นตอนที่ 3: อัพเดทและ Deploy Frontend ใหม่

## 3.1 อัพเดทไฟล์ `.env.production`

เปิดไฟล์:
```
/Users/kwanjirakakate/QR Code Web App/client/.env.production
```

แก้เป็น (ใช้ URL ที่ได้จาก Vercel):
```
VITE_API_URL=https://qrcode-webapp.vercel.app
```

**หมายเหตุ:** แทนที่ `qrcode-webapp.vercel.app` ด้วย URL จริงที่คุณได้จาก Vercel

---

## 3.2 Build Frontend

```bash
cd /Users/kwanjirakakate/QR\ Code\ Web\ App/client
npm run build
```

**ควรเห็น:**
```
✓ built in X.XXs
```

---

## 3.3 Deploy ไปที่ Firebase

```bash
firebase deploy
```

**ควรเห็น:**
```
✔  Deploy complete!
Hosting URL: https://qrcode-webapp.web.app
```

---

# 📋 ขั้นตอนที่ 4: ทดสอบระบบทั้งหมด

## 4.1 เปิดเว็บไซต์

```
https://qrcode-webapp.web.app
```

---

## 4.2 ทดสอบ Register

1. คลิก **"Sign Up"**
2. กรอกข้อมูล:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `123456`
3. คลิก **"Sign Up"**

**ถ้าสำเร็จ:**
- จะเข้าสู่ Dashboard
- เห็นหน้าสร้าง QR Code

**ถ้าเจอ error:**
- เปิด Browser DevTools (กด F12)
- ดูที่แท็บ Console
- บอกผมว่าเจอ error อะไร

---

## 4.3 ทดสอบ Login

1. Logout (ถ้ายัง login อยู่)
2. คลิก **"Sign In"**
3. ใส่ email และ password ที่สมัครไว้
4. คลิก **"Sign In"**

**ถ้าสำเร็จ:**
- เข้าสู่ระบบได้
- เห็น Dashboard

---

## 4.4 ทดสอบสร้าง QR Code

1. คลิก **"Create New QR"** หรือ **"สร้าง QR Code"**
2. กรอก:
   - ชื่อ: `Test QR`
   - URL: `https://google.com`
3. คลิก **"สร้าง"**

**ถ้าสำเร็จ:**
- เห็น QR Code ใหม่
- สามารถ scan ได้
- สามารถแก้ไข URL ได้

---

# ✅ เสร็จสิ้น!

## 🎉 ระบบของคุณพร้อมใช้งานแล้ว!

| ส่วน | สถานะ | URL |
|------|-------|-----|
| **Frontend** | ✅ Deploy แล้ว | https://qrcode-webapp.web.app |
| **Backend** | ✅ Deploy แล้ว | https://qrcode-webapp.vercel.app |
| **Database** | ✅ พร้อมใช้งาน | Supabase (cloud) |

---

## 🔧 Troubleshooting

### ปัญหา: ยังเจอ 404 Error

**ตรวจสอบ:**
1. ดูว่า Backend deploy สำเร็จหรือยัง → เปิด `https://YOUR-APP.vercel.app/api/health`
2. ตรวจสอบ `.env.production` ว่ามี URL ของ Vercel ที่ถูกต้อง
3. ตรวจสอบว่า build และ deploy frontend ใหม่แล้ว

### ปัญหา: CORS Error

**ตรวจสอบ:**
1. `CLIENT_URL` ใน Vercel Environment Variables = `https://qrcode-webapp.web.app`
2. ไฟล์ `server/index.js` มี Firebase domain ใน allowedOrigins

### ปัญหา: Cannot Login/Register

**ตรวจสอบ:**
1. เปิด Browser DevTools (F12) → Console
2. ดู error message
3. ตรวจสอบว่า Environment Variables ใน Vercel ครบทั้ง 7 ตัว

### ปัญหา: Vercel Deploy Failed

**ตรวจสอบ:**
1. ดู logs ใน Vercel Dashboard
2. ตรวจสอบว่าไฟล์ `vercel.json` มีอยู่ใน root directory
3. ตรวจสอบว่า `package.json` มี `"type": "module"`

---

## 📞 ต้องการความช่วยเหลือ?

ถ้ามีปัญหาในขั้นตอนไหน:
1. เปิด Browser DevTools (F12) → Console
2. ดู error message
3. บอกผมว่าเจอ error อะไร ผมจะช่วยแก้ไข

---

**Happy Deploying! 🚀**
