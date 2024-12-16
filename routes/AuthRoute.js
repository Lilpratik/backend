const { Login, createUser } = require("../controllers/AuthController");
const { userVerification, authenticateToken, authorizeRole } = require("../middleware/AuthMiddleware");
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
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  Login // Directly using the destructured Login function here
);

// Create User Route
router.post(
  '/create-user',
  authenticateToken,
  authorizeRole(['Admin']),
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').isIn(['Admin', 'Supervisor', 'Event Manager', 'Client']).withMessage('Role is required and must be valid'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  createUser // Directly using the destructured createUser function here
);

module.exports = router;
