const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,   // Event name is required
    trim: true,   // Removes extra spaces
  },
  description: {
    type: String,
    required: true,   // Event description is required
    trim: true,  // Removes extra spaces
  },
  assignedSupervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",   // Reference to the User Model (Supervisor)
    required: true,
  },
  assignedEventManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",  // Reference to the user Model (Event manager)
    required: true,
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task"  //  Reference to the task model
  }],
  progress: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed"],
    default: "Not Started",
  },
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true
  },
  deleted: {
    type: Boolean,
    default: false  // soft delete flag
  },
}, {timestamps: true}); // Automatically add createdAt and updatedAt fields

// Indexing for better performance when quering by supervisor, event manager, and client
eventSchema.index({ assignedSupervisor: 1, assignedEventManager: 1, client_id: 1 });
eventSchema.index({ progress: 1 }); // Added index for progress field


//creating the event model
const Event = mongoose.model("Event", eventSchema);

module.exports = Event; // Exporting the Event model
