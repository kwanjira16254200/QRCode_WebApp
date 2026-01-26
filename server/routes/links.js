import express from 'express';
import {
  createLink,
  getLinks,
  getLink,
  updateLink,
  deleteLink,
  getLinkAnalytics,
  getDashboardStats
} from '../controllers/linkController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getLinks)
  .post(createLink);

router.get('/dashboard/stats', getDashboardStats);

router.route('/:id')
  .get(getLink)
  .put(updateLink)
  .delete(deleteLink);

router.get('/:id/analytics', getLinkAnalytics);

export default router;
