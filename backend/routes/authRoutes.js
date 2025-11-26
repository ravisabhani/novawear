import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { forgotLimiter } from '../middleware/rateLimiter.js';
import { protect } from '../middleware/authMiddleware.js';
import validators from '../middleware/validators.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validators.register, validators.validate, registerUser);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get token
 * @access  Public
 */
router.post('/login', validators.login, validators.validate, loginUser);

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user
 * @access  Private
 */
router.get('/me', protect, getMe);

/**
 * @route   POST /api/auth/forgot
 * @desc    Send password reset email
 * @access  Public
 */
router.post('/forgot', forgotLimiter, validators.forgot, validators.validate, forgotPassword);

/**
 * @route   POST /api/auth/reset/:token
 * @desc    Reset user password
 * @access  Public
 */
router.post('/reset/:token', validators.reset, validators.validate, resetPassword);

export default router;

