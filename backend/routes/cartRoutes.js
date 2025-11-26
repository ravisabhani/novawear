import express from 'express';
import {
  getCart,
  addItem,
  updateItem,
  removeItem,
  checkout,
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Require auth for all cart routes
router.use(protect);

router.get('/', getCart);
router.post('/item', addItem);
router.put('/item/:productId', updateItem);
router.delete('/item/:productId', removeItem);
router.post('/checkout', checkout);

export default router;
