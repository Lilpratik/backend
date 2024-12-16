const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRole } = require("../middleware/AuthMiddleware");
const { createEvent, updateEvent, deleteEvent, getEventDetails, getAllEvents } = require("../controllers/EventController");
const { body, validationResult } = require("express-validator");

// Create an event (Admin, Supervisor)
router.post(
  '/create-event',
  authenticateToken,
  authorizeRole(['Admin', 'Supervisor']),
  [
    body('eventName').notEmpty().withMessage('Event name is required'), // Field names updated
    body('description').notEmpty().withMessage('Event description is required'),
    body('assignedSupervisor').notEmpty().withMessage('Assigned supervisor is required'),
    body('assignedEventManager').notEmpty().withMessage('Assigned event manager is required'),
    body('client_id').notEmpty().withMessage('Client ID is required'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  createEvent // Correctly uses the destructured createEvent function
);

// Get client events (Client-specific)
router.get(
  '/get-client-events',
  authenticateToken,
  authorizeRole(['Client']), // Only Clients should have access to this
  async (req, res) => {
    try {
      const clientId = req.user.id; // Assuming `req.user.id` stores the client ID from the JWT token

      // Fetch events associated with the client_id from your database
      const events = await Event.find({ client_id: clientId }); // Adjust this according to your model

      if (!events || events.length === 0) {
        return res.status(404).json({ message: "No events found for this client" });
      }

      res.json(events); // Return events associated with the client
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);


// Get all events (Admin, Supervisor)
router.get(
  '/get-events',
  authenticateToken,
  authorizeRole(['Admin', 'Supervisor']),
  async (req, res) => {
    try {
      const events = await getAllEvents(req, res); // Corrected function call
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

// Get event details (Supervisor, Event Manager, Admin)
router.get(
  '/get-event/:id',
  authenticateToken,
  authorizeRole(['Supervisor', 'Event Manager', 'Admin', 'Client']),
  getEventDetails
);

// Update event (Supervisor, Event Manager, Admin)
router.put(
  '/update-event/:id',
  authenticateToken,
  authorizeRole(['Supervisor', 'Event Manager', 'Admin']),
  [
    body('eventName').optional().notEmpty().withMessage('Event name cannot be empty'), // Field names updated
    body('description').optional().notEmpty().withMessage('Event description cannot be empty'),
    body('assignedSupervisor').optional().notEmpty().withMessage('Assigned supervisor cannot be empty'),
    body('assignedEventManager').optional().notEmpty().withMessage('Assigned event manager cannot be empty'),
    body('client_id').optional().notEmpty().withMessage('Client ID cannot be empty'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  updateEvent
);

// Delete event (Supervisor, Admin)
router.delete(
  '/delete-event/:id',
  authenticateToken,
  authorizeRole(['Supervisor', 'Admin']),
  deleteEvent
);

module.exports = router;
