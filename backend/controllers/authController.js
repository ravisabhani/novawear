import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, adminSecret } = req.body;

  // Validate input
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields (name, email, password)',
    });
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email',
    });
  }

  // Determine role: default to 'user'. Allow creating an admin only when a correct
  // ADMIN_SECRET is provided (keeps admin creation gated and auditable).
  let role = 'user';
  // No invite token support - admin creation must use ADMIN_SECRET only

  if (adminSecret) {
    if (!process.env.ADMIN_SECRET) {
      return res.status(403).json({
        success: false,
        message: 'Admin creation is not allowed: server not configured to accept adminSecret',
      });
    }

    if (adminSecret === process.env.ADMIN_SECRET) {
      role = 'admin';
    } else {
      return res.status(403).json({
        success: false,
        message: 'Invalid admin secret',
      });
    }
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  if (user) {
    // Generate token and send response
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Invalid user data',
    });
  }
});

/**
 * @desc    Authenticate user and get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password',
    });
  }

  // Find user and include password (since it's select: false by default)
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  // Check password
  const isPasswordMatch = await user.matchPassword(password);

  if (!isPasswordMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  // Generate token and send response
  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    },
  });
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc    Request password reset
 * @route   POST /api/auth/forgot
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Please provide an email address' });
  }

  const user = await User.findOne({ email });

  // Always return a generic message for security
  if (!user) {
    return res.status(200).json({ success: true, message: 'If an account exists for this email, a reset link has been sent' });
  }

  // Create reset token
  const resetToken = crypto.randomBytes(20).toString('hex');
  const hashed = crypto.createHash('sha256').update(resetToken).digest('hex');

  user.resetPasswordToken = hashed;
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset/${resetToken}`;

  const message = `<p>You requested a password reset. Click the link below to set a new password (valid for 1 hour):</p>\n<p><a href="${resetUrl}">${resetUrl}</a></p>`;

  try {
    await sendEmail({ to: user.email, subject: 'Password reset for NovaWear', html: message, text: `Reset URL: ${resetUrl}` });

    res.status(200).json({ success: true, message: 'If an account exists for this email, a reset link has been sent' });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(500).json({ success: false, message: 'Unable to send email' });
  }
});

/**
 * @desc    Reset user password
 * @route   POST /api/auth/reset/:token
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ success: false, message: 'Invalid request' });
  }

  const hashed = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({ resetPasswordToken: hashed, resetPasswordExpires: { $gt: Date.now() } }).select('+password');

  if (!user) {
    return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  const authToken = generateToken(user._id);

  res.status(200).json({ success: true, message: 'Password reset successful', data: { token: authToken } });
});

