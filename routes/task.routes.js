const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRole } = require("../middleware/AuthMiddleware");
const { createTask, updateTask, deleteTask, getTasksByEvent } = require("../controllers/TaskController");
const { body, param, validationResult } = require("express-validator");

// Middleware for validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Create a new task (Supervisor, Event Manager, Admin)
router.post(
  '/:event_id/create-task',
  authenticateToken,
  authorizeRole(['Supervisor', 'Event Manager', 'Admin']),
  [
    body('task_name').notEmpty().withMessage('Task name is required'),
    body('due_date').isDate().withMessage('Due date must be a valid date'),
    body('linked_event').isMongoId().withMessage('Event ID must be a valid MongoDB ID'),
    body('priority').optional().isIn(["Low", "Medium", "High"]).withMessage('Priority must be Low, Medium, or High'),
  ],
  handleValidationErrors,
  createTask // Directly using the `createTask` controller method
);

// Get tasks by event (Supervisor, Event Manager, Admin, Client)
router.get(
  '/:eventId/tasks',
  authenticateToken,
  authorizeRole(['Supervisor', 'Event Manager', 'Admin', 'Client']),
  [
    param('eventId').isMongoId().withMessage('Event ID must be a valid MongoDB ID'),
  ],
  handleValidationErrors,
  getTasksByEvent // Directly using the `getTasksByEvent` controller method
);

// Update a task (Supervisor, Event Manager, Admin)
router.put(
  '/tasks/:taskId',
  authenticateToken,
  authorizeRole(['Supervisor', 'Event Manager', 'Admin']),
  [
    param('taskId').isMongoId().withMessage('Task ID must be a valid MongoDB ID'),
    body('task_name').optional().notEmpty().withMessage('Task name cannot be empty'),
    body('due_date').optional().isDate().withMessage('Due date must be a valid date'),
    body('priority').optional().isIn(["Low", "Medium", "High"]).withMessage('Priority must be Low, Medium, or High'),
  ],
  handleValidationErrors,
  updateTask // Directly using the `updateTask` controller method
);

// Soft delete a task (Supervisor, Event Manager, Admin)
router.delete(
  '/tasks/:taskId',
  authenticateToken,
  authorizeRole(['Supervisor', 'Admin', 'Event Manager']),
  [
    param('taskId').isMongoId().withMessage('Task ID must be a valid MongoDB ID'),
  ],
  handleValidationErrors,
  deleteTask // Directly using the `deleteTask` controller method
);

module.exports = router;
