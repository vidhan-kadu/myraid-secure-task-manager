const Task = require("../models/Task");
const { encrypt, decrypt } = require("../utils/encryption");

exports.createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "All fields required" });
    }

    const encryptedDesc = encrypt(description);

    const task = await Task.create({
      title,
      description: encryptedDesc,
      user: req.user,
    });

    res.status(201).json(task);
  } catch (error) {
    console.log("Create Task Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.getTasks = async (req, res) => {
  console.log("Get Tasks for user:", req.user);
  try {
    const { page = 1, status, search } = req.query;

    const query = {};
    if(req.user) {
      query.user = req.user;
    }

    if (status) query.status = status;
    if (search) query.title = { $regex: search, $options: "i" };

    const tasks = await Task.find(query)
      .skip((page - 1) * 5)
      .limit(5)
      .sort({ createdAt: -1 });

    const decryptedTasks = tasks.map((task) => {
      let desc = task.description;

      try {
        if (task.description) {
          desc = decrypt(task.description);
        }
      } catch (e) {
        console.log("Decrypt failed:", e.message);
        desc = task.description; // fallback
      }

      return {
        ...task._doc,
        description: desc,
      };
    });

    res.json(decryptedTasks);
  } catch (error) {
    console.log("GET TASK ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.description) {
      updateData.description = encrypt(updateData.description);
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      updateData,
      { new: true },
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    let desc = task.description;
    try {
      desc = decrypt(task.description);
    } catch (e) {}

    res.json({
      ...task._doc,
      description: desc,
    });
  } catch (error) {
    console.log("Update Task Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.log("Delete Task Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};
