const Task = require("../models/Task");

//Post
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    //create Task
    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      user: req.userId,
    });

    res.status(201).json({
      message: "Task Created Successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

//Get
const getTasks = async (req, res) => {
  try {
    const { search, status, priority, sort } = req.query;

    // Base filter: only logged-in user's tasks
    const filter = {
      user: req.userId,
    };

    // Search by title
    if (search) {
      filter.title = {
        $regex: search,
        $options: "i",
      };
    }

    // Filter by status
    if (status) {
      filter.status = status;
    }

    // Filter by priority
    if (priority) {
      filter.priority = priority;
    }

    // Sorting
    let sortOption = { createdAt: -1 };

    if (sort === "dueDate") {
      sortOption = { dueDate: 1 };
    }

    if (sort === "priority") {
      sortOption = { priority: 1 };
    }

    const tasks = await Task.find(filter).sort(sortOption);

    res.status(200).json({
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

//Update
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, description, status, priority, dueDate } = req.body || {};

    const task = await Task.findOne({
      _id: id,
      user: req.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.status = status ?? task.status;
    task.priority = priority ?? task.priority;
    task.dueDate = dueDate ?? task.dueDate;

    await task.save();

    res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error("Update task error:", error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

//Delete
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({
      _id: id,
      user: req.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

//Analytics
const getTaskAnalytics = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments({
      user: req.userId,
    });

    const completedTasks = await Task.countDocuments({
      user: req.userId,
      status: "completed",
    });

    const pendingTasks = await Task.countDocuments({
      user: req.userId,
      status: { $ne: "completed" },
    });

    const completionPercentage =
      totalTasks === 0
        ? 0
        : Math.round((completedTasks / totalTasks) * 100);

    res.status(200).json({
      totalTasks,
      completedTasks,
      pendingTasks,
      completionPercentage,
    });
  } catch (error) {
    console.error("Analytics error:", error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = { createTask,getTasks,updateTask,deleteTask,getTaskAnalytics};
