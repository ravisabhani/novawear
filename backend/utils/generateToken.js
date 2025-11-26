import jwt from 'jsonwebtoken';

/**
 * Generate JWT token for authenticated user
 * @param {string} userId - User ID to encode in token
 * @returns {string} JWT token
 */
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    // Provide a clear runtime error to help debugging when server wasn't configured
    throw new Error('JWT_SECRET is not set. Set JWT_SECRET in environment variables to enable authentication.');
  }

  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

export default generateToken;

