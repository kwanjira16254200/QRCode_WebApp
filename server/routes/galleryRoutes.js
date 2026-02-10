import express from 'express';
import { 
  createGallery, 
  getGallery, 
  getUserGalleries, 
  deleteGallery 
} from '../controllers/galleryController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public route - no auth required
router.get('/:id', getGallery);

// Protected routes - require authentication
router.post('/', authenticate, createGallery);
router.get('/user/all', authenticate, getUserGalleries);
router.delete('/:id', authenticate, deleteGallery);

export default router;
