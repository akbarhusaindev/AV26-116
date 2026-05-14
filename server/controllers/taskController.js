import { Task } from "../models/Task.js";

const VALID_FILTERS = ["all", "completed", "pending", "high"];

export async function createTask(req, res) {
  try {
    const { title, description, priority, status, dueDate } = req.body;

    if (!title || !String(title).trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      userId: req.user._id,
      title: title.trim(),
      description: (description || "").trim(),
      priority: ["low", "medium", "high"].includes(priority) ? priority : "medium",
      status: status === "completed" ? "completed" : "pending",
      dueDate: dueDate ? new Date(dueDate) : null,
    });

    res.status(201).json({ task });
  } catch (err) {
    console.error("createTask error:", err);
    res.status(500).json({ message: "Failed to create task" });
  }
}

export async function getTasks(req, res) {
  try {
    const filter = VALID_FILTERS.includes(req.query.filter) ? req.query.filter : "all";
    const query = { userId: req.user._id };

    if (filter === "completed") query.status = "completed";
    else if (filter === "pending") query.status = "pending";
    else if (filter === "high") {
      query.priority = "high";
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json({ tasks });
  } catch (err) {
    console.error("getTasks error:", err);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
}

export async function updateTask(req, res) {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const { title, description, priority, status, dueDate } = req.body;

    if (title !== undefined) task.title = String(title).trim();
    if (description !== undefined) task.description = String(description).trim();
    if (priority !== undefined && ["low", "medium", "high"].includes(priority)) {
      task.priority = priority;
    }
    if (status !== undefined && ["pending", "completed"].includes(status)) {
      task.status = status;
    }
    if (dueDate !== undefined) {
      task.dueDate = dueDate ? new Date(dueDate) : null;
    }

    await task.save();
    res.json({ task });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid task id" });
    }
    console.error("updateTask error:", err);
    res.status(500).json({ message: "Failed to update task" });
  }
}

export async function deleteTask(req, res) {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task removed", id: task._id });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid task id" });
    }
    console.error("deleteTask error:", err);
    res.status(500).json({ message: "Failed to delete task" });
  }
}
