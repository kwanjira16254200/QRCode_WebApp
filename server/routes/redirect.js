import express from 'express';
import { redirect } from '../controllers/redirectController.js';

const router = express.Router();

router.get('/:shortCode', redirect);

export default router;
