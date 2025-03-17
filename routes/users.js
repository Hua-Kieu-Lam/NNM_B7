const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Create User
router.post("/", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all users (filter: username, fullName, loginCount range)
router.get("/", async (req, res) => {
  try {
    let { username, fullName, minLogin, maxLogin } = req.query;
    let filter = { isDeleted: false };

    if (username) filter.username = new RegExp(username, "i");
    if (fullName) filter.fullName = new RegExp(fullName, "i");
    if (minLogin) filter.loginCount = { $gte: parseInt(minLogin) };
    if (maxLogin) filter.loginCount = { ...filter.loginCount, $lte: parseInt(maxLogin) };

    const users = await User.find(filter).populate("role");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("role");
    if (!user || user.isDeleted) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user by username
router.get("/username/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username, isDeleted: false }).populate("role");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update User
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Soft Delete User
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    res.json({ message: "User deleted (soft delete)", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update status if email and username match
router.post("/activate", async (req, res) => {
  try {
    const { email, username } = req.body;
    const user = await User.findOne({ email, username, isDeleted: false });

    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = true;
    await user.save();
    res.json({ message: "User activated", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

