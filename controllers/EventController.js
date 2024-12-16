const Event = require("../models/EventModel");

// Function to create an event
module.exports.createEvent = async (req, res) => {
  const { eventName, description, assignedSupervisor, assignedEventManager, client_id } = req.body; // Field names updated to match schema
  try {
    // Create a new Event object
    const newEvent = new Event({ eventName, description, assignedSupervisor, assignedEventManager, client_id });

    // Save the event to the database
    await newEvent.save();

    res.status(201).json({
      message: "Event created successfully",
      success: true,
      event: newEvent,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      // Handle Mongoose validation errors explicitly
      return res.status(400).json({
        message: "Validation failed",
        success: false,
        errors: error.errors,
      });
    }

    res.status(500).json({
      message: "Server error",
      success: false,
      error,
    });
  }
};

// Function to get all events
module.exports.getAllEvents = async (req, res) => {
  const { assignedSupervisor, assignedEventManager, client_id } = req.body;

  const filter = { deleted: false }; // Exclude deleted events by default

  if (assignedSupervisor) filter.assignedSupervisor = assignedSupervisor;
  if (assignedEventManager) filter.assignedEventManager = assignedEventManager;
  if (client_id) filter.client_id = client_id;

  try {
    const events = await Event.find(filter);
    res.status(200).json({
      message: "Events retrieved successfully",
      success: true,
      events,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      success: false,
      error,
    });
  }
};

// Function to get event details (excluding deleted ones)
module.exports.getEventDetails = async (req, res) => {
  const { id } = req.params; // Assume event ID is provided in the URL as a route parameter

  try {
    const event = await Event.findOne({ _id: id, deleted: false }); // Ensure we exclude the deleted ones
    if (!event) {
      return res.status(404).json({
        message: "Event not found",
        success: false,
      });
    }
    res.status(200).json({
      message: "Event details retrieved successfully",
      success: true,
      event,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      success: false,
      error,
    });
  }
};

// Function to update an event
module.exports.updateEvent = async (req, res) => {
  const { id } = req.params; // Assume event ID is provided in the URL as a route parameter
  const updateData = req.body;

  try {
    const updatedEvent = await Event.findByIdAndUpdate(id, updateData, { new: true }); // Return the updated document

    if (!updatedEvent) {
      return res.status(404).json({
        message: "Event not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Event updated successfully",
      success: true,
      event: updatedEvent,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      success: false,
      error,
    });
  }
};

// Function to delete an event (soft delete)
module.exports.deleteEvent = async (req, res) => {
  const { id } = req.params; // Assume event ID is provided in the URL as a route parameter

  try {
    const deletedEvent = await Event.findByIdAndUpdate(id, { deleted: true }, { new: true }); // Mark event as deleted and return the updated document
    if (!deletedEvent) {
      return res.status(404).json({
        message: "Event not found",
        success: false,
      });
    }
    res.status(200).json({
      message: "Event deleted successfully",
      success: true,
      event: deletedEvent,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      success: false,
      error,
    });
  }
};
