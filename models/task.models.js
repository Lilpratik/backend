const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  task_name: {
    type: String,
    required: true, // Task Name is required
    trim: true, // Removes extra spaces
  },
  description: {
    type: String,
    required: false, // Task description is optional
    trim: true, // Removes extra spaces
  },
  status: {
    type: String,
    enum: ["Pending", "In-Progress", "Completed"], // Status can only be one of these values
    default: "Pending", // Default status is "Pending"
  },
  due_date: {
    type: Date,
    required: true, // Due Date is required
  },
  linked_event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
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
taskSchema.index({ linked_event: 1 });
taskSchema.index({ status: 1 }); // Added index for status field to improve filtering performance

// Optional: Ensure the due date is always in the future
taskSchema.path('due_date').validate(function(value) {
  return value > Date.now(); // Ensures due_date is in the future
}, 'Due date must be a future date');

// Creating the Task model
const Task = mongoose.model("Task", taskSchema);

// Exporting the Task model
module.exports = Task;
