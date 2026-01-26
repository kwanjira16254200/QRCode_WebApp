import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './config/supabase.js';
import authRoutes from './routes/auth.js';
import linkRoutes from './routes/links.js';
import redirectRoutes from './routes/redirect.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use('/r', redirectRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running', database: 'Supabase' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
});
