# 🚀 คู่มือ Deploy Backend แบบ Step-by-Step

## ข้อมูลที่คุณมีอยู่แล้ว ✅

จากไฟล์ `.env.local` คุณมี Supabase credentials พร้อมแล้ว:
- ✅ SUPABASE_URL: `https://pnozpuxxqcbnijragick.supabase.co`
- ✅ SUPABASE_ANON_KEY: มีแล้ว
- ✅ SUPABASE_SERVICE_KEY: มีแล้ว
- ✅ JWT_SECRET: มีแล้ว

---

## 📋 Step 1: เตรียม GitHub Repository

### 1.1 ตรวจสอบว่ามี Git repository แล้วหรือยัง

```bash
cd /Users/kwanjirakakate/QR\ Code\ Web\ App
git status
```

### 1.2 ถ้ายังไม่มี repository ให้สร้างใหม่:

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - QR Code Web App"
```

### 1.3 Push ขึ้น GitHub:

1. ไปที่ https://github.com และ login
2. คลิก "New repository" (ปุ่มสีเขียว)
3. ตั้งชื่อ repository เช่น `qrcode-webapp`
4. **อย่า** เลือก "Initialize with README"
5. คลิก "Create repository"
6. Copy คำสั่งที่ GitHub แสดงให้ แล้วรันใน Terminal:

```bash
git remote add origin https://github.com/YOUR_USERNAME/qrcode-webapp.git
git branch -M main
git push -u origin main
```

---

## 📋 Step 2: สมัครและตั้งค่า Render.com

### 2.1 สมัครบัญชี Render

1. ไปที่ https://render.com
2. คลิก **"Get Started for Free"**
3. เลือก **"Sign up with GitHub"** (แนะนำ - ง่ายที่สุด)
4. อนุญาตให้ Render เข้าถึง GitHub

### 2.2 สร้าง Web Service ใหม่

1. หลังจาก login แล้ว คลิก **"New +"** ที่มุมบนขวา
2. เลือก **"Web Service"**
3. เลือก **"Build and deploy from a Git repository"**
4. คลิก **"Next"**

### 2.3 เชื่อมต่อ Repository

1. ถ้าเห็น repository `qrcode-webapp` ให้คลิก **"Connect"**
2. ถ้าไม่เห็น ให้คลิก **"Configure account"** แล้วอนุญาตให้ Render เข้าถึง repository

---

## 📋 Step 3: ตั้งค่า Web Service

### 3.1 กรอกข้อมูล Service:

| ฟิลด์ | ค่าที่ต้องกรอก |
|------|----------------|
| **Name** | `qrcode-webapp-api` (หรือชื่ออื่นที่ชอบ) |
| **Region** | `Singapore` (ใกล้ไทยที่สุด) |
| **Branch** | `main` |
| **Root Directory** | ปล่อยว่าง (ใช้ root) |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server/index.js` |

### 3.2 เลือก Plan:

- เลือก **"Free"** (ฟรี แต่จะ sleep ถ้าไม่มีคนใช้ 15 นาที)
- หรือ **"Starter"** ($7/เดือน - ไม่ sleep, เร็วกว่า)

---

## 📋 Step 4: ตั้งค่า Environment Variables (สำคัญมาก!)

### 4.1 ใน Render Dashboard:

1. เลื่อนลงมาที่ส่วน **"Environment Variables"**
2. คลิก **"Add Environment Variable"**
3. เพิ่มตัวแปรทั้งหมดนี้:

### 4.2 Environment Variables ที่ต้องเพิ่ม:

**คัดลอกค่าจากไฟล์ `.env.local` ของคุณ:**

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

### 4.3 วิธีเพิ่ม Environment Variable:

1. คลิก **"Add Environment Variable"**
2. ใส่ **Key** (เช่น `PORT`)
3. ใส่ **Value** (เช่น `5000`)
4. คลิก **"Add"**
5. ทำซ้ำสำหรับทุกตัวแปรข้างบน

---

## 📋 Step 5: Deploy!

### 5.1 เริ่ม Deploy:

1. เลื่อนลงมาล่างสุด
2. คลิกปุ่ม **"Create Web Service"** สีน้ำเงิน
3. รอ Render build และ deploy (ประมาณ 2-5 นาที)

### 5.2 ดู Deploy Logs:

- คุณจะเห็น logs แสดงความคืบหน้า:
  ```
  ==> Building...
  ==> Installing dependencies...
  ==> Starting server...
  🚀 Server running on port 5000
  ✅ Supabase connected
  ```

### 5.3 เมื่อ Deploy สำเร็จ:

- สถานะจะเป็น **"Live"** สีเขียว
- คุณจะได้ URL เช่น: `https://qrcode-webapp-api.onrender.com`
- **คัดลอก URL นี้ไว้** - จะใช้ในขั้นตอนถัดไป

---

## 📋 Step 6: ทดสอบ Backend API

### 6.1 ทดสอบว่า API ทำงาน:

เปิด browser ไปที่:
```
https://qrcode-webapp-api.onrender.com/api/health
```

ควรเห็น:
```json
{
  "status": "OK",
  "message": "Server is running",
  "database": "Supabase"
}
```

✅ ถ้าเห็นแบบนี้ แสดงว่า Backend deploy สำเร็จแล้ว!

---

## 📋 Step 7: อัพเดท Frontend Configuration

### 7.1 แก้ไขไฟล์ `.env.production`:

เปิดไฟล์ `/Users/kwanjirakakate/QR Code Web App/client/.env.production`

แก้เป็น (ใช้ URL ที่ได้จาก Render):
```
VITE_API_URL=https://qrcode-webapp-api.onrender.com
```

**หมายเหตุ:** แทนที่ `qrcode-webapp-api.onrender.com` ด้วย URL จริงที่คุณได้จาก Render

---

## 📋 Step 8: Build และ Deploy Frontend ใหม่

### 8.1 Build Frontend:

```bash
cd /Users/kwanjirakakate/QR\ Code\ Web\ App/client
npm run build
```

### 8.2 Deploy ไปที่ Firebase:

```bash
firebase deploy
```

### 8.3 รอจนเสร็จ:

```
✔  Deploy complete!
Hosting URL: https://qrcode-webapp.web.app
```

---

## 📋 Step 9: ทดสอบระบบทั้งหมด

### 9.1 เปิดเว็บไซต์:

```
https://qrcode-webapp.web.app
```

### 9.2 ทดสอบ Register:

1. คลิก **"Sign Up"**
2. กรอกข้อมูล:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `123456`
3. คลิก **"Sign Up"**
4. ถ้าสำเร็จจะเข้าสู่ Dashboard

### 9.3 ทดสอบ Login:

1. Logout
2. คลิก **"Sign In"**
3. ใส่ email และ password ที่สมัครไว้
4. คลิก **"Sign In"**
5. ควรเข้าสู่ระบบได้

---

## ✅ เสร็จสิ้น!

ตอนนี้ระบบของคุณ deploy เรียบร้อยแล้ว:

- ✅ Backend API: `https://qrcode-webapp-api.onrender.com`
- ✅ Frontend: `https://qrcode-webapp.web.app`
- ✅ Database: Supabase (cloud)
- ✅ ใช้งานได้จากทุกที่ในโลก

---

## 🔧 Troubleshooting

### ปัญหา: Backend deploy ไม่สำเร็จ

**ตรวจสอบ:**
1. ดู logs ใน Render Dashboard
2. ตรวจสอบว่า Environment Variables ครบทั้ง 7 ตัว
3. ตรวจสอบว่า `package.json` มี `"type": "module"`

### ปัญหา: ไม่สามารถ Login/Register ได้

**ตรวจสอบ:**
1. เปิด Browser DevTools (F12) → Console
2. ดูว่ามี error อะไร
3. ตรวจสอบว่า `.env.production` มี URL ของ Render ที่ถูกต้อง
4. ตรวจสอบว่า build และ deploy frontend ใหม่แล้ว

### ปัญหา: CORS Error

**แก้ไข:**
1. ตรวจสอบว่า `CLIENT_URL` ใน Render = `https://qrcode-webapp.web.app`
2. ตรวจสอบว่า `server/index.js` มี Firebase domain ใน allowedOrigins

### ปัญหา: Render Free Plan นอนหลับ (Cold Start)

**อาการ:**
- Request แรกช้ามาก (30-60 วินาที)
- เพราะ Render Free จะ sleep หลังไม่มีคนใช้ 15 นาที

**แก้ไข:**
- Upgrade เป็น Starter Plan ($7/เดือน)
- หรือใช้ cron job ping ทุก 10 นาที (แต่ Render อาจแบน)

---

## 📞 ต้องการความช่วยเหลือ?

ถ้ามีปัญหาในขั้นตอนไหน:
1. ตรวจสอบ logs ใน Render Dashboard
2. ตรวจสอบ Browser Console (F12)
3. ดู error message แล้วแก้ตามที่แนะนำ

**Happy Deploying! 🚀**
