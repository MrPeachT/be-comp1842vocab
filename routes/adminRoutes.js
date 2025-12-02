const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

const User = require("../models/userModel");
const { authRequired, requireRole } = require("../middleware/auth");

router.get(
  "/users",
  authRequired,
  requireRole("admin"),
  async (req, res) => {
    try {
      const users = await User.find().lean();
      res.json(users);
    } catch (err) {
      console.error("Admin list users error:", err);
      res.status(500).json({ error: "Failed to list users" });
    }
  }
);

router.get(
  "/users/:id",
  authRequired,
  requireRole("admin"),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id).lean();
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (err) {
      console.error("Admin get user error:", err);
      res.status(400).json({ error: "Invalid user ID" });
    }
  }
);

router.post(
  "/users",
  authRequired,
  requireRole("admin"),
  async (req, res) => {
    try {
      const { email, password, role } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ error: "Email already in use" });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await User.create({
        email,
        passwordHash,
        role: role === "admin" ? "admin" : "student"
      });

      res.status(201).json({
        _id: user._id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      });
    } catch (err) {
      console.error("Admin create user error:", err);
      res.status(500).json({ error: "Failed to create user" });
    }
  }
);

router.put(
  "/users/:id/role",
  authRequired,
  requireRole("admin"),
  async (req, res) => {
    try {
      const { role } = req.body;

      if (
        String(req.user.id) === String(req.params.id) &&
        role !== "admin"
      ) {
        return res
          .status(400)
          .json({ error: "You cannot remove your own admin role" });
      }

      await User.findByIdAndUpdate(req.params.id, { role });
      res.json({ message: "Role updated" });
    } catch (err) {
      console.error("Admin update role error:", err);
      res.status(500).json({ error: "Failed to update role" });
    }
  }
);

router.put(
  "/users/:id",
  authRequired,
  requireRole("admin"),
  async (req, res) => {
    try {
      const update = {
        email: req.body.email,
        role: req.body.role
      };

      if (req.body.password) {
        update.passwordHash = await bcrypt.hash(req.body.password, 10);
      }

      await User.findByIdAndUpdate(req.params.id, update);
      res.json({ message: "User updated" });
    } catch (err) {
      console.error("Admin full update user error:", err);
      res.status(500).json({ error: "Failed to update user" });
    }
  }
);

router.delete(
  "/users/:id",
  authRequired,
  requireRole("admin"),
  async (req, res) => {
    try {
      if (String(req.user.id) === String(req.params.id)) {
        return res
          .status(400)
          .json({ error: "You cannot delete your own account" });
      }

      await User.findByIdAndDelete(req.params.id);
      res.json({ message: "User deleted" });
    } catch (err) {
      console.error("Admin delete user error:", err);
      res.status(500).json({ error: "Failed to delete user" });
    }
  }
);

module.exports = router;