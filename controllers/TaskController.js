const Task = require("../models/TaskModel");
const Event = require("../models/EventModel");

// Create a new task
module.exports.createTask = async (req, res) => {
  try {
    console.log("Received request body: ", req.body); // Log the request body

    const { taskName, description, status, dueDate, assignedTo, event } = req.body;

    console.log("Received event: ", event); // Log the event

    // Find the event by ID
    const eventFound = await Event.findById(event);
    if (!eventFound) {
      console.log("Event not found for id: ", event);
      return res.status(404).json({ message: "Event not found" });
    }

    // Create a new task and associate it with the event
    const newTask = new Task({ taskName, description, status, dueDate, assignedTo, event });
    await newTask.save();

    // Push the new task ID into the event's tasks array and save the event
    eventFound.tasks.push(newTask._id);
    await eventFound.save();

    res.status(201).json({ message: "Task created successfully", success: true, task: newTask });
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

    // Define filter to retrieve tasks for the specific event
    const filter = { event: eventId, deleted: false };

    // If the user is an admin, include deleted tasks
    if (req.user.role === "admin") {
      delete filter.deleted; // Remove the `deleted: false` filter for admin
    }

    // Fetch the tasks based on the filter
    const tasks = await Task.find(filter);

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

    // Find the task and update it
    const updatedTask = await Task.findByIdAndUpdate(taskId, updates, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task updated successfully", success: true, task: updatedTask });
  } catch (error) {
    console.error("Error updating task: ", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete task
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

    res.status(200).json({ message: "Task deleted successfully", success: true, task: deletedTask });
  } catch (error) {
    console.error("Error deleting task: ", error);
    res.status(500).json({ message: "Server error", error });
  }
};
