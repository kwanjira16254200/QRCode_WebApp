# 🚀 คู่มือการติดตั้งและใช้งาน Dynamic QR Code Web App

## 📋 ข้อกำหนดเบื้องต้น

- Node.js (v16 หรือสูงกว่า)
- MongoDB (Local หรือ MongoDB Atlas)
- npm หรือ yarn

## 🔧 การติดตั้ง

### 1. ติดตั้ง Dependencies

```bash
# ติดตั้ง backend dependencies
npm install

# ติดตั้ง frontend dependencies
cd client
npm install
cd ..
```

### 2. ตั้งค่า Environment Variables

สร้างไฟล์ `.env` ในโฟลเดอร์หลัก:

```bash
cp .env.example .env
```

แก้ไขไฟล์ `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/qrcode-app
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**สำคัญ:** เปลี่ยน `JWT_SECRET` เป็นค่าที่ปลอดภัยของคุณเอง!

### 3. เริ่มต้น MongoDB

#### ใช้ MongoDB Local:

```bash
# macOS (ถ้าติดตั้งผ่าน Homebrew)
brew services start mongodb-community

# หรือรันแบบ manual
mongod --config /usr/local/etc/mongod.conf
```

#### ใช้ MongoDB Atlas (Cloud):

1. ไปที่ https://www.mongodb.com/cloud/atlas
2. สร้าง Free Cluster
3. สร้าง Database User
4. เพิ่ม IP Address ของคุณใน Network Access (หรือใช้ 0.0.0.0/0 สำหรับ development)
5. คัดลอก Connection String และใส่ใน `.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/qrcode-app?retryWrites=true&w=majority
```

### 4. รันแอปพลิเคชัน

#### รัน Development Mode (แนะนำ):

```bash
npm run dev
```

คำสั่งนี้จะรัน Backend และ Frontend พร้อมกัน:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

#### รันแยกกัน:

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run client
```

## 📱 การใช้งาน

### 1. สมัครสมาชิก
- เปิด http://localhost:5173
- คลิก "สมัครสมาชิก"
- กรอกข้อมูล: ชื่อ, อีเมล, รหัสผ่าน
- คลิก "สมัครสมาชิก"

### 2. สร้าง QR Code
- หลังจาก Login จะเข้าสู่หน้า Dashboard
- คลิกปุ่ม "สร้าง QR Code"
- กรอก:
  - **ชื่อ QR Code**: ชื่อเพื่อจดจำ (เช่น "เว็บไซต์ของฉัน")
  - **URL ปลายทาง**: URL ที่ต้องการให้ Redirect ไป (เช่น https://google.com)
- คลิก "สร้าง"
- ระบบจะสร้าง Short Link (เช่น http://localhost:5173/r/AbCd1234)

### 3. จัดการ QR Code
- **ดาวน์โหลด QR Code**: คลิกที่ QR Code แล้วเลือก "แก้ไข" → "ดาวน์โหลด QR Code"
- **แก้ไข URL**: คลิก "แก้ไข" → เปลี่ยน URL ปลายทาง → "บันทึก"
- **ดูสถิติ**: คลิก "สถิติ" เพื่อดูจำนวนการสแกนและกราฟ
- **ลบ QR Code**: คลิกปุ่มถังขยะสีแดง

### 4. ทดสอบ QR Code
- สแกน QR Code ด้วยมือถือ หรือ
- คลิก "ทดสอบลิงก์" เพื่อเปิดใน Browser
- ระบบจะบันทึกสถิติและ Redirect ไปยัง URL ปลายทาง

## 🎯 Features

### ✅ ที่ทำได้แล้ว:
- ✅ ระบบ Authentication (Login/Register) ด้วย JWT
- ✅ สร้าง Dynamic QR Code
- ✅ สร้าง Short Link อัตโนมัติ (nanoid 8 ตัวอักษร)
- ✅ Dashboard แสดง QR Code ทั้งหมด
- ✅ แก้ไข URL ปลายทางได้ (Dynamic!)
- ✅ เปิด/ปิดใช้งาน QR Code
- ✅ ดาวน์โหลด QR Code เป็นรูปภาพ PNG
- ✅ ติดตามสถิติการสแกน (Analytics)
- ✅ กราฟแสดงสถิติรายวัน (30 วัน)
- ✅ แสดงข้อมูลการคลิกล่าสุด
- ✅ UI สวยงามด้วย Tailwind CSS
- ✅ Responsive Design

## 🏗️ โครงสร้างโปรเจค

```
qr-code-web-app/
├── client/                      # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # Navigation bar
│   │   │   └── PrivateRoute.jsx # Protected route wrapper
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Authentication context
│   │   ├── pages/
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── Register.jsx     # Register page
│   │   │   ├── Dashboard.jsx    # Main dashboard
│   │   │   ├── EditLink.jsx     # Edit QR Code
│   │   │   └── Analytics.jsx    # Analytics page
│   │   ├── utils/
│   │   │   └── api.js           # Axios instance
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Tailwind CSS
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── server/                      # Backend (Node.js + Express)
│   ├── controllers/
│   │   ├── authController.js    # Auth logic
│   │   ├── linkController.js    # Link CRUD + Analytics
│   │   └── redirectController.js # Redirect handler
│   ├── middleware/
│   │   └── auth.js              # JWT verification
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Link.js              # Link schema
│   │   └── Analytics.js         # Analytics schema
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   ├── links.js             # Link routes
│   │   └── redirect.js          # Redirect routes
│   └── index.js                 # Express server
├── .env                         # Environment variables (สร้างจาก .env.example)
├── .env.example                 # Template
├── .gitignore
├── package.json
├── README.md
└── SETUP.md                     # ไฟล์นี้
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - สมัครสมาชิก
- `POST /api/auth/login` - เข้าสู่ระบบ
- `GET /api/auth/me` - ดูข้อมูลผู้ใช้ (ต้อง login)

### Links (ต้อง login ทั้งหมด)
- `GET /api/links` - ดู QR Links ทั้งหมดของผู้ใช้
- `POST /api/links` - สร้าง QR Link ใหม่
- `GET /api/links/:id` - ดูข้อมูล QR Link
- `PUT /api/links/:id` - แก้ไข QR Link
- `DELETE /api/links/:id` - ลบ QR Link
- `GET /api/links/:id/analytics` - ดูสถิติของ Link
- `GET /api/links/dashboard/stats` - ดูสถิติรวมใน Dashboard

### Redirect (Public)
- `GET /r/:shortCode` - Redirect และบันทึกสถิติ

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**แก้ไข:** ตรวจสอบว่า MongoDB กำลังทำงานอยู่
```bash
brew services list  # ดูสถานะ
brew services start mongodb-community  # เริ่มต้น MongoDB
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**แก้ไข:** เปลี่ยน PORT ในไฟล์ `.env` หรือปิดโปรแกรมที่ใช้ port นั้นอยู่

### JWT Error
```
Error: Not authorized, token failed
```
**แก้ไข:** 
1. ตรวจสอบว่า `JWT_SECRET` ในไฟล์ `.env` ถูกต้อง
2. ลอง Logout และ Login ใหม่
3. ลบ localStorage ใน Browser DevTools

### Tailwind CSS ไม่ทำงาน
**แก้ไข:** ตรวจสอบว่าติดตั้ง dependencies ครบแล้ว:
```bash
cd client
npm install tailwindcss postcss autoprefixer
```

## 🚀 Production Deployment

### Backend (Node.js)
1. ตั้งค่า Environment Variables บน Server
2. ใช้ PM2 หรือ Docker
3. ตั้งค่า Reverse Proxy (Nginx)

### Frontend (React)
1. Build:
```bash
cd client
npm run build
```
2. Deploy ไปยัง Netlify, Vercel, หรือ Static Hosting

### Database
- ใช้ MongoDB Atlas สำหรับ Production
- ตั้งค่า Backup อัตโนมัติ

## 📝 Notes

- QR Code ใช้ระดับ Error Correction: **High (H)** - ทนต่อความเสียหายได้ ~30%
- Short Code ใช้ nanoid ความยาว 8 ตัวอักษร (URL-safe)
- JWT Token หมดอายุใน 30 วัน
- Analytics เก็บข้อมูล: timestamp, userAgent, referer, ipAddress

## 📞 Support

หากมีปัญหาหรือข้อสงสัย:
1. ตรวจสอบ Console ใน Browser DevTools (F12)
2. ตรวจสอบ Terminal logs ของ Backend
3. ตรวจสอบว่า MongoDB ทำงานปกติ

## 🎉 Happy Coding!

ขอให้สนุกกับการสร้าง QR Code! 🚀
