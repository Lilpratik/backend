const Event = require("../models/event.models");
const User = require("../models/user.models");

// Create Event
module.exports.createEvent = async (req, res) => {
  try {
    const { event_name, description, assigned_supervisor, assigned_event_manager, tasks, progress, client, actual_event_date, due_date, expected_completion, priority, location } = req.body;

    // Check if all required fields are present
    if (!event_name || !description || !assigned_supervisor || !assigned_event_manager || !client || !actual_event_date || !due_date) {
      return res.status(400).json({ status: "error", message: "All fields are required except 'expected_completion', 'priority', and 'location'" });
    }

    // Create the event
    const newEvent = new Event({
      event_name,
      description,
      assigned_supervisor,
      assigned_event_manager,
      tasks,
      progress,
      client,
      actual_event_date,
      due_date,
      expected_completion,
      priority: priority || "Low", // Default to Low if not provided
      location: location || "Not Provided", // Default to "Not Provided" if not provided
    });

    await newEvent.save();

    res.status(201).json({
      status: "success",
      message: "Event created successfully",
      event: newEvent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// Get All Events
module.exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("assigned_supervisor assigned_event_manager client tasks");
    res.status(200).json({
      status: "success",
      message: "Events retrieved successfully",
      events,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// Get Event by ID
module.exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("assigned_supervisor assigned_event_manager client tasks");

    if (!event) {
      return res.status(404).json({ status: "error", message: "Event not found" });
    }

    res.status(200).json({
      status: "success",
      message: "Event retrieved successfully",
      event,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// Update Event
module.exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!event) {
      return res.status(404).json({ status: "error", message: "Event not found" });
    }

    res.status(200).json({
      status: "success",
      message: "Event updated successfully",
      event,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// Delete Event
module.exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ status: "error", message: "Event not found" });
    }

    res.status(200).json({
      status: "success",
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
