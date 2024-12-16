const express = require("express");
const router = express.Router();
const Task = require("../models/TaskModel");
const Event = require("../models/EventModel");
const { authenticateToken, authorizeRole } = require("../middleware/AuthMiddleware");
const { createTask, updateTask, deleteTask } = require("../controllers/TaskController");
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
    '/create-task',
    authenticateToken,
    authorizeRole(['Supervisor', 'Event Manager', 'Admin']),
    [
        body('taskName').notEmpty().withMessage('Task name is required'),
        body('dueDate').isDate().withMessage('Due date must be a valid date'),
        body('assignedTo').notEmpty().withMessage('Assigned user is required'),
        body('event').isMongoId().withMessage('Event ID must be a valid MongoDB ID'),
    ],
    handleValidationErrors,
    createTask // Directly using the `createTask` controller method
);

// Get tasks by event or all tasks (Supervisor, Event Manager, Admin, Client)
router.get(
    '/get-task/:eventId',
    authenticateToken,
    authorizeRole(['Supervisor', 'Event Manager', 'Admin', 'Client']),
    [
        param('eventId').isMongoId().withMessage('Event ID must be a valid MongoDB ID'),
    ],
    handleValidationErrors,
    async (req, res) => {
        try {
            const { eventId } = req.params;

            // Fetch tasks for the given event
            const tasks = await Task.find({ event: eventId, deleted: false });
            if (!tasks.length) {
                return res.status(404).json({ message: "No tasks found for this event" });
            }

            res.json({ success: true, tasks });
        } catch (error) {
            res.status(500).json({ message: "Server error", error });
        }
    }
);

// Update a task (Supervisor, Event Manager, Admin)
router.put(
    '/update-task/:taskId',
    authenticateToken,
    authorizeRole(['Supervisor', 'Event Manager', 'Admin']),
    [
        param('taskId').isMongoId().withMessage('Task ID must be a valid MongoDB ID'),
        body('taskName').optional().notEmpty().withMessage('Task name cannot be empty'),
        body('dueDate').optional().isDate().withMessage('Due date must be a valid date'),
        body('assignedTo').optional().notEmpty().withMessage('Assigned user is required'),
    ],
    handleValidationErrors,
    updateTask // Directly using the `updateTask` controller method
);

// Soft delete a task (Supervisor, Event Manager, Admin)
router.delete(
    '/delete-task/:taskId',
    authenticateToken,
    authorizeRole(['Supervisor', 'Admin', 'Event Manager']),
    [
        param('taskId').isMongoId().withMessage('Task ID must be a valid MongoDB ID'),
    ],
    handleValidationErrors,
    deleteTask // Directly using the `deleteTask` controller method
);

module.exports = router;
