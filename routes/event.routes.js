const express = require("express");
const router = express.Router();
const { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent } = require("../controllers/eventController");
const { authenticateToken, authorizeRole } = require("../middleware/auth.middlewares");
const { body, validationResult } = require("express-validator");

// Create Event (Admin only)
router.post(
  "/",
  authenticateToken,
  authorizeRole(["Admin", "Supervisor"]), // You may want to allow Event Managers to create events as well
  [
    body("event_name").notEmpty().withMessage("Event name is required"),
    body("description").notEmpty().withMessage("Event description is required"),
    body("assigned_supervisor").notEmpty().withMessage("Assigned Supervisor is required"),
    body("assigned_event_manager").notEmpty().withMessage("Assigned Event Manager is required"),
    body("client").notEmpty().withMessage("Client is required"),
    body("actual_event_date").notEmpty().withMessage("Actual Event Date is required"),
    body("due_date").notEmpty().withMessage("Due Date is required"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "error", errors: errors.array() });
    }
    next();
  },
  createEvent
);

// Get All Events (Admin, Event Manager, Supervisor)
router.get("/", authenticateToken, authorizeRole(["Admin", "Supervisor", "Event-Manager"]), getAllEvents);

// Get Event by ID (Admin, Event Manager, Supervisor, Client)
router.get("/:id", authenticateToken, authorizeRole(["Admin", "Supervisor", "Event-Manager", "Client"]), getEventById);

// Update Event (Admin, Supervisor)
router.put(
  "/:id",
  authenticateToken,
  authorizeRole(["Admin", "Supervisor"]),
  [
    body("event_name").notEmpty().withMessage("Event name is required"),
    body("description").notEmpty().withMessage("Event description is required"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "error", errors: errors.array() });
    }
    next();
  },
  updateEvent
);

// Delete Event (Admin only)
router.delete("/:id", authenticateToken, authorizeRole(["Admin"]), deleteEvent);

module.exports = router;
