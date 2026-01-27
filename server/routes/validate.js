import express from 'express';
import https from 'https';
import http from 'http';

const router = express.Router();

// Validate if URL is reachable
router.post('/url', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ 
        valid: false, 
        message: 'กรุณากรอก URL' 
      });
    }

    // Check URL format first
    let urlObj;
    try {
      urlObj = new URL(url);
    } catch (error) {
      return res.status(400).json({ 
        valid: false, 
        message: 'URL ไม่ถูกต้อง' 
      });
    }

    // Only allow http and https
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return res.status(400).json({ 
        valid: false, 
        message: 'รองรับเฉพาะ HTTP และ HTTPS เท่านั้น' 
      });
    }

    // Check if URL is reachable
    const isReachable = await checkUrlReachable(url);
    
    if (isReachable) {
      return res.json({ 
        valid: true, 
        message: 'URL ถูกต้องและเข้าถึงได้' 
      });
    } else {
      return res.status(400).json({ 
        valid: false, 
        message: 'ไม่สามารถเข้าถึง URL นี้ได้ กรุณาตรวจสอบว่า URL ถูกต้องและเว็บไซต์ทำงานอยู่' 
      });
    }
  } catch (error) {
    console.error('URL validation error:', error);
    return res.status(500).json({ 
      valid: false, 
      message: 'เกิดข้อผิดพลาดในการตรวจสอบ URL' 
    });
  }
});

// Helper function to check if URL is reachable
function checkUrlReachable(url) {
  return new Promise((resolve) => {
    try {
      const urlObj = new URL(url);
      const protocol = urlObj.protocol === 'https:' ? https : http;
      
      const options = {
        method: 'HEAD',
        timeout: 5000, // 5 second timeout
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; QRCodeBot/1.0)'
        }
      };

      const req = protocol.request(url, options, (res) => {
        // Consider 2xx and 3xx status codes as valid
        if (res.statusCode >= 200 && res.statusCode < 400) {
          resolve(true);
        } else {
          resolve(false);
        }
      });

      req.on('error', () => {
        resolve(false);
      });

      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });

      req.end();
    } catch (error) {
      resolve(false);
    }
  });
}

export default router;
