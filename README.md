# Dynamic QR Code Web App

เว็บแอปพลิเคชันสำหรับสร้าง Dynamic QR Code พร้อมระบบ Analytics และการจัดการลิงก์

## Features

- 🔐 ระบบ Authentication (Login/Register) ด้วย JWT
- 📱 สร้าง Dynamic QR Code
- 🔗 สร้าง Short Link (my-app.com/r/AbCd1)
- 📊 Dashboard พร้อม Analytics
- 📈 ติดตามสถิติการสแกน QR Code
- ✏️ แก้ไข URL ปลายทางได้แม้หลังสร้าง QR แล้ว
- 🎨 UI สวยงามด้วย Tailwind CSS

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router v6
- qrcode.react
- Axios
- Lucide React (Icons)
- Recharts (Analytics Charts)

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs

## Installation

### 1. Clone และติดตั้ง Dependencies

```bash
# ติดตั้ง backend dependencies
npm install

# ติดตั้ง frontend dependencies
cd client
npm install
cd ..
```

### 2. ตั้งค่า Environment Variables

สร้างไฟล์ `.env` จาก `.env.example`:

```bash
cp .env.example .env
```

แก้ไขค่าใน `.env`:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: เปลี่ยนเป็น secret key ของคุณ
- `PORT`: พอร์ตของ backend (default: 5000)

### 3. เริ่มต้น MongoDB

ตรวจสอบให้แน่ใจว่า MongoDB กำลังทำงานอยู่:

```bash
# macOS (ถ้าติดตั้งผ่าน Homebrew)
brew services start mongodb-community

# หรือใช้ MongoDB Atlas (Cloud)
```

### 4. รันแอปพลิเคชัน

```bash
# รัน development mode (frontend + backend พร้อมกัน)
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## การใช้งาน

1. **สมัครสมาชิก/เข้าสู่ระบบ**
   - เปิดเว็บไซต์และสมัครสมาชิกใหม่
   - หรือเข้าสู่ระบบด้วยบัญชีที่มีอยู่

2. **สร้าง QR Code**
   - คลิก "Create New QR"
   - ใส่ URL ปลายทางที่ต้องการ
   - ระบบจะสร้าง Short Link และ QR Code ให้

3. **จัดการ QR Code**
   - ดู QR Code ทั้งหมดใน Dashboard
   - แก้ไข URL ปลายทาง
   - ดูสถิติการสแกน
   - ดาวน์โหลด QR Code

4. **Analytics**
   - ดูจำนวนการสแกนทั้งหมด
   - ดูกราฟสถิติตามวันที่
   - ดูข้อมูลการสแกนแต่ละ QR Code

## API Endpoints

### Authentication
- `POST /api/auth/register` - สมัครสมาชิก
- `POST /api/auth/login` - เข้าสู่ระบบ
- `GET /api/auth/me` - ดูข้อมูลผู้ใช้

### QR Links
- `GET /api/links` - ดู QR Links ทั้งหมดของผู้ใช้
- `POST /api/links` - สร้าง QR Link ใหม่
- `GET /api/links/:id` - ดูข้อมูล QR Link
- `PUT /api/links/:id` - แก้ไข QR Link
- `DELETE /api/links/:id` - ลบ QR Link
- `GET /api/links/:id/analytics` - ดูสถิติ

### Redirect
- `GET /r/:shortCode` - Redirect และบันทึกสถิติ

## Project Structure

```
qr-code-web-app/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/    # React Components
│   │   ├── pages/         # Pages
│   │   ├── context/       # Context API
│   │   ├── utils/         # Utilities
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   └── package.json
├── server/                # Backend (Node.js + Express)
│   ├── models/           # Mongoose Models
│   ├── routes/           # API Routes
│   ├── middleware/       # Middleware
│   ├── controllers/      # Controllers
│   └── index.js
├── package.json
├── .env.example
└── README.md
```

## License

ISC
