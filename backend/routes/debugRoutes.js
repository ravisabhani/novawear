import express from 'express';
import { seedProducts, seedSample } from '../controllers/debugController.js';

const router = express.Router();

// POST /api/debug/seed-products
router.post('/seed-products', seedProducts);

// POST /api/debug/seed-sample
router.post('/seed-sample', seedSample);

export default router;
