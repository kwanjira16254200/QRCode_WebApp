import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './config/supabase.js';
import authRoutes from './routes/auth.js';
import linkRoutes from './routes/links.js';
import redirectRoutes from './routes/redirect.js';
import validateRoutes from './routes/validate.js';

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://qrcode-webapp.web.app',
  'https://qrcode-webapp.firebaseapp.com'
];

if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error && error.code !== 'PGRST116') {
      console.error('❌ Supabase connection error:', error.message);
    } else {
      console.log('✅ Supabase connected');
    }
  } catch (err) {
    console.error('❌ Supabase connection error:', err.message);
  }
};

testSupabaseConnection();

app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/validate', validateRoutes);
app.use('/s', redirectRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running', database: 'Supabase' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
});
