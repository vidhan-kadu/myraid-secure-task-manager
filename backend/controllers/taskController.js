const Task = require("../models/Task");
const { encrypt, decrypt } = require("../utils/encryption");

exports.createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const encryptedDesc = encrypt(description);
    const task = await Task.create({
      title,
      description: encryptedDesc,
      user: req.user,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { page = 1, status, search } = req.query;

    const query = { user: req.user };

    if (status) query.status = status;
    if (search) query.title = { $regex: search, $options: "i" };

    const tasks = await Task.find(query)
      .skip((page - 1) * 5)
      .limit(5)
      .sort({ createdAt: -1 });

    const decryptedTasks = tasks.map((task) => ({
      ...task._doc,
      description: decrypt(task.description),
    }));

    res.json(decryptedTasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      req.body,
      { new: true },
    );

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });

    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
