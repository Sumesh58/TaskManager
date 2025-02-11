const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/taskmanager")
    .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log("MongoDB connection error:", error));

// Task Schema
const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const Task = mongoose.model("Task", TaskSchema);

// Routes

// GET: Retrieve all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tasks", error });
  }
});

// POST: Create a new task
app.post("/tasks", async (req, res) => {
  const { title, description } = req.body;
  try {
    const newTask = new Task({ title, description });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error });
  }
});

// PUT: Update a task by ID
app.put("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
});

// DELETE: Delete a task by ID
app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
