const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  event_name: {
    type: String,
    required: true,   // Event name is required
    trim: true,   // Removes extra spaces
  },
  description: {
    type: String,
    required: true,   // Event description is required
    trim: true,  // Removes extra spaces
  },
  assigned_supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",   // Reference to the User Model (Supervisor)
    required: true,
  },
  assigned_event_manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",  // Reference to the User Model (Event manager)
    required: true,
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task"  // Reference to the Task Model
  }],
  progress: {
    type: String,
    enum: ["Pending", "In-Progress", "Completed"],
    default: "Pending",
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  actual_event_date: {
    type: Date,
    required: true,
  },
  due_date: {
    type: Date,
    required: true,
  },
  expected_completion: {
    type: Date,
    required: false,
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium", // Default priority
  },
  location: {
    type: String,
    required: false, // Location is optional, can be changed based on requirements
  },
  deleted: {
    type: Boolean,
    default: false,  // Soft delete flag
  },
}, {timestamps: true}); // Automatically adds createdAt and updatedAt fields

// Indexing for better performance when querying by supervisor, event manager, and client
eventSchema.index({ assigned_supervisor: 1, assigned_event_manager: 1, client: 1 });
eventSchema.index({ progress: 1 }); // Added index for progress field


// Event priority validation (ensure `expected_completion` is after `due_date` if present)
eventSchema.path('expected_completion').validate(function(value) {
  return !value || value > this.due_date;  // If `expected_completion` exists, ensure it’s after `due_date`
}, 'Expected completion date must be after the due date');

// Creating the Event model
const Event = mongoose.model("Event", eventSchema);

module.exports = Event; // Exporting the Event model
