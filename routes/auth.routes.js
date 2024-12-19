const { Login, createUser } = require("../controllers/AuthController");
const { authenticateToken, authorizeRole } = require("../middleware/AuthMiddleware");
const router = require("express").Router();
const { body, validationResult } = require("express-validator");

// Login Route
router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'error', errors: errors.array() });
    }
    next();
  },
  Login // Login handler
);

// Create User Route
router.post(
  '/create-user',
  authenticateToken,  // Authenticate the token
  authorizeRole(['Admin']),  // Ensure the user is an admin
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').isIn(['Admin', 'Supervisor', 'Event Manager', 'Client']).withMessage('Role is required and must be valid'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'error', errors: errors.array() });
    }
    next();
  },
  createUser // User creation handler
);

module.exports = router;
