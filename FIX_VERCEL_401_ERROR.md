# 🔧 แก้ไข Vercel 401 Unauthorized Error

## 🔴 ปัญหา

Backend บน Vercel ส่ง **401 Unauthorized** และ redirect ไปหน้า login ของ Vercel  
ทำให้ Frontend ไม่สามารถเรียก API ได้

**สาเหตุ:** Vercel deployment ถูกตั้งค่าเป็น **Private** (ต้อง login Vercel ถึงจะเข้าถึงได้)

---

## ✅ วิธีแก้ - ทำให้ Deployment เป็น Public

### ขั้นตอนที่ 1: เปิด Vercel Dashboard

1. ไปที่ https://vercel.com/dashboard
2. เลือก project **"qr-code-web-app"** หรือชื่อที่คุณตั้ง

### ขั้นตอนที่ 2: ตั้งค่า Deployment Protection

1. คลิกแท็บ **"Settings"** (ด้านบน)
2. เลื่อนลงหา **"Deployment Protection"** (ทางซ้าย)
3. ดูที่ส่วน **"Protection Level"**

### ขั้นตอนที่ 3: เปลี่ยนเป็น Public

มี 2 แบบ:

#### แบบที่ 1: ปิด Protection (แนะนำ)
1. หาส่วน **"Vercel Authentication"** หรือ **"Protection Bypass for Automation"**
2. **ปิด** หรือตั้งเป็น **"Disabled"**
3. คลิก **"Save"**

#### แบบที่ 2: เปลี่ยน Protection Level
1. หาส่วน **"Protection Level"**
2. เปลี่ยนจาก **"Standard Protection"** เป็น **"Only Preview Deployments"**
3. หรือเลือก **"Disabled"**
4. คลิก **"Save"**

### ขั้นตอนที่ 4: Redeploy

หลังจากเปลี่ยนการตั้งค่าแล้ว:

1. ไปที่แท็บ **"Deployments"**
2. คลิก **"..."** (three dots) ที่ deployment ล่าสุด
3. เลือก **"Redeploy"**
4. คลิก **"Redeploy"** อีกครั้งเพื่อยืนยัน
5. รอ 1-2 นาที

---

## 🧪 ทดสอบว่าแก้ไขสำเร็จ

### ทดสอบ 1: เปิด Browser (ไม่ต้อง login Vercel)

เปิด URL นี้ใน **Incognito/Private Window**:
```
https://qr-code-web-33iwisc9p-qr-code-web-apps-projects.vercel.app/api/health
```

**ผลลัพธ์ที่ต้องการ:**
```json
{
  "status": "OK",
  "message": "Server is running",
  "database": "Supabase"
}
```

**ถ้ายังเจอ:** หน้า login ของ Vercel = ยังไม่เป็น public

### ทดสอบ 2: ลอง Login ที่ Frontend

1. เปิด https://qrcode-webapp.web.app
2. ลอง Login
3. ควรเข้าสู่ระบบได้โดยไม่มี 404 error

---

## 📸 ภาพประกอบ Settings

ใน Vercel Settings → Deployment Protection:

**ก่อนแก้ไข:**
```
✅ Vercel Authentication (Enabled)
   Require Vercel login to access deployments
```

**หลังแก้ไข:**
```
❌ Vercel Authentication (Disabled)
   Anyone can access deployments
```

---

## 🎯 สรุป

1. ✅ เปิด Vercel Dashboard
2. ✅ Settings → Deployment Protection
3. ✅ ปิด Vercel Authentication
4. ✅ Redeploy
5. ✅ ทดสอบ `/api/health` ใน Incognito
6. ✅ ลอง Login ที่ Frontend

---

**หลังจากทำตามนี้แล้ว Login จะทำงานได้!** 🚀
