const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskName: {
    type: String,
    required: true, // Task Name is required
    trim: true, // Removes extra spaces
  },
  description: {
    type: String,
    required: true, // Task description is required
    trim: true, // Removes extra spaces
  },
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed"], // Status can only be one of these values
    default: "Not Started", // Default status is "Pending"
    required: true, // Status is required
  },
  dueDate: {
    type: Date,
    required: true, // Due Date is required
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the user model (the user assigned to this task)
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event", // Reference to the event model (the event this task is associated with)
    required: true,
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"], // Priority can only be one of these values
    default: "Low", // Default priority is "Low"
    required: true, // Priority is required
  },
  deleted: {
    type: Boolean,
    default: false // soft delete
  }
}, {timestamps: true}); // Automatically adds createdAt and updatedAt fields

// Indexing for performance improvement
taskSchema.index({ assignedTo: 1, event: 1 });
taskSchema.index({ status: 1 }); // Added index for status field to improve filtering performance

// Creating the task model
const Task = mongoose.model("Task", taskSchema);

// Exporting the Task model
module.exports = Task;
