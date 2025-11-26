import rateLimit from 'express-rate-limit';

// Limit forgot/reset requests to prevent email spam/abuse
export const forgotLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // limit each IP to 5 requests per windowMs
  message: { success: false, message: 'Too many password reset requests from this IP, please try again later' },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,
  // Use a header for tests if provided so tests can simulate different IPs deterministically
  keyGenerator: (req) => req.headers['x-test-ip'] || req.ip,
});

export default forgotLimiter;
