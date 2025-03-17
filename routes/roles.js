const express = require("express");
const Role = require("../models/Role");
const router = express.Router();

// Create Role
router.post("/", async (req, res) => {
    try {
        const role = new Role(req.body);
        await role.save();
        res.status(201).json(role);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all Roles
router.get("/", async (req, res) => {
    try {
        const roles = await Role.find();
        res.json(roles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Role by ID
router.get("/:id", async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) return res.status(404).json({ message: "Role not found" });
        res.json(role);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Role by name
router.get("/name/:name", async (req, res) => {
    try {
        const role = await Role.findOne({ name: req.params.name });
        if (!role) return res.status(404).json({ message: "Role not found" });
        res.json(role);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Role
router.put("/:id", async (req, res) => {
    try {
        const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(role);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete Role
router.delete("/:id", async (req, res) => {
    try {
        await Role.findByIdAndDelete(req.params.id);
        res.json({ message: "Role deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
