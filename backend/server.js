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
// Configure allowed origins from environment for production deployments
// - In development this defaults to the Vite dev server at http://localhost:5173
const allowedOrigins = [];
if (process.env.CLIENT_URL) {
  // Allow a single CLIENT_URL set on Render/production
  allowedOrigins.push(process.env.CLIENT_URL);
}
// Support a comma-separated ALLOWED_ORIGINS env var for flexibility
if (process.env.ALLOWED_ORIGINS) {
  process.env.ALLOWED_ORIGINS.split(',').forEach((o) => {
    const trimmed = o.trim();
    if (trimmed) allowedOrigins.push(trimmed);
  });
}
// Always allow the dev client locally when running on developer machines
if (!allowedOrigins.includes('http://localhost:5173')) allowedOrigins.push('http://localhost:5173');

// Helpful startup log so the Render service logs show what origins were configured
console.log('Allowed CORS origins:', allowedOrigins.join(', '));

// Use a dynamic origin handler so the CORS response echoes back the incoming
// origin when it's allowed (good for single-page apps hosted on different hosts)
app.use(
  cors({
    origin: (incomingOrigin, callback) => {
      // If no origin provided (server-to-server or curl) allow it
      if (!incomingOrigin) return callback(null, true);

      // Full wildcard override (use cautiously in production)
      if (process.env.ALLOW_ALL_ORIGINS === 'true') return callback(null, true);

      // Allow any localhost origin on any port (useful when running local dev from any port)
      try {
        const isLocalhost = /^https?:\/\/localhost(:\d+)?$/i.test(incomingOrigin);
        if (isLocalhost) return callback(null, true);
      } catch (e) {
        // fallthrough to exact match
      }

      // Exact match against configured allowedOrigins
      if (allowedOrigins.includes(incomingOrigin)) return callback(null, true);

      return callback(new Error('CORS origin not allowed'));
    },
    credentials: true,
  })
);

// Lightweight debug endpoint to inspect the currently configured origins at runtime
app.get('/api/debug/origins', (req, res) => {
  res.json({ success: true, allowedOrigins, incomingOrigin: req.headers.origin || null });
});
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

