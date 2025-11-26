import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xssClean from 'xss-clean';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

// Load environment variables
dotenv.config();

// Ensure JWT_SECRET is configured in a developer-friendly way.
// - In production we require a secret to be explicitly set (fail early)
// - In development we provide a non-production default so running locally doesn't crash unexpectedly
if (!process.env.JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    console.error('FATAL: JWT_SECRET environment variable must be set in production. Aborting startup.');
    process.exit(1);
  }

  // development or unspecified: auto-set a clear default and log a helpful message
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'novawear_dev_jwt_secret';
  console.warn('Warning: JWT_SECRET not set — using a development default. Set JWT_SECRET in .env for realistic auth behavior.');
}

// Initialize Express app
const app = express();

// Middleware
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
// Security middlewares
app.use(helmet()); // Sets various HTTP headers for basic protections
app.use(mongoSanitize()); // Prevent NoSQL injection by sanitizing req.body, req.query, req.params
app.use(xssClean()); // Sanitize user input from HTML input
app.use(hpp()); // Prevent HTTP parameter pollution
app.use(cookieParser()); // Parse cookies

// Global rate limiter to limit repeated requests to public APIs and endpoints
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

// Apply rate limiter to all requests
app.use(globalLimiter);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'NovaWear API is running! 🚀',
    version: '1.0.0',
  });
});

// Test connectivity route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Frontend connected to Backend ✔' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

// 404 handler for undefined routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server (only when not in test mode)
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

// Export the app for tests and other tools that want to mount it without starting network listeners
export default app;

