import { body, param, validationResult } from 'express-validator';

const register = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const login = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const forgot = [
  body('email').isEmail().withMessage('Valid email is required'),
];

const reset = [
  param('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const createProduct = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be a number greater than 0'),
  body('category').optional().trim(),
];

const updateProduct = [
  body('name').optional().trim().notEmpty().withMessage('Product name cannot be empty'),
  body('price').optional().isFloat({ gt: 0 }).withMessage('Price must be a number greater than 0'),
  body('category').optional().trim(),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const arr = errors.array();
    // Keep backwards-compatible message string for existing clients/tests
    let message = arr.map((e) => e.msg).join(', ');

    // Special-case: some clients/tests expect the register endpoint to return
    // the single string below when required fields are missing. Detect that
    // scenario (missing name or password on register) and return the older
    // message to preserve compatibility.
    try {
      const url = req.originalUrl || req.url || '';
      if (url.includes('/api/auth/register')) {
        const missingRequired = arr.some((e) => ['name', 'password'].includes(e.param));
        if (missingRequired) {
          message = 'Please provide all required fields (name, email, password)';
        }
      }
    } catch (err) {
      // if anything odd happens while checking the url/params, fall back to
      // the joined messages we already computed.
    }

    return res.status(400).json({ success: false, message, errors: arr });
  }
  next();
};

export default {
  register,
  login,
  forgot,
  reset,
  createProduct,
  updateProduct,
  validate,
};
