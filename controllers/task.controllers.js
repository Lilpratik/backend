const Task = require("../models/task.models");
const Event = require("../models/event.models");

// Create a new task
module.exports.createTask = async (req, res) => {
  try {
    console.log("Received request body: ", req.body); // Log the request body

    const { task_name, description, status, due_date, linked_event, priority } = req.body;

    // Find the event by ID to ensure it exists
    const eventFound = await Event.findById(linked_event);
    if (!eventFound) {
      console.log("Event not found for id: ", linked_event);
      return res.status(404).json({ message: "Event not found" });
    }

    // Create the new task with the provided data
    const newTask = new Task({
      task_name,
      description,
      status: status || "Pending", // Default to "Pending" if no status is provided
      due_date,
      linked_event,
      priority: priority || "Low", // Default to "Low" if no priority is provided
    });

    // Save the new task to the database
    await newTask.save();

    res.status(201).json({
      message: "Task created successfully",
      success: true,
      task: newTask,
    });
  } catch (error) {
    console.error("Error creating task: ", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get tasks by event
module.exports.getTasksByEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;

    // Ensure the event ID is provided
    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    // Fetch tasks for the given event
    const tasks = await Task.find({ linked_event: eventId, deleted: false });

    if (!tasks.length) {
      return res.status(404).json({ message: "No tasks found for this event" });
    }

    res.status(200).json({ message: "Tasks retrieved successfully", success: true, tasks });
  } catch (error) {
    console.error("Error retrieving tasks: ", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Update task
module.exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;

    // Ensure the task ID is provided
    if (!taskId) {
      return res.status(400).json({ message: "Task ID is required" });
    }

    const updates = req.body;

    // Find the task by ID and update it
    const updatedTask = await Task.findByIdAndUpdate(taskId, updates, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({
      message: "Task updated successfully",
      success: true,
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task: ", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Soft delete a task
module.exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;

    // Ensure the task ID is provided
    if (!taskId) {
      return res.status(400).json({ message: "Task ID is required" });
    }

    // Soft delete the task (set deleted flag to true)
    const deletedTask = await Task.findByIdAndUpdate(taskId, { deleted: true }, { new: true });
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({
      message: "Task deleted successfully",
      success: true,
      task: deletedTask,
    });
  } catch (error) {
    console.error("Error deleting task: ", error);
    res.status(500).json({ message: "Server error", error });
  }
};
