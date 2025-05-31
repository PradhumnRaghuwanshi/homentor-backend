const express = require("express");
const router = express.Router();
const Notice = require("../models/Notices");

// GET all notices
router.get("/", async (req, res) => {
  try {
    const notices = await Notice.find().sort({ date: -1 });
    res.status(200).json({ data: notices });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST a new notice
router.post("/", async (req, res) => {
  try {
    const notice = new Notice(req.body);
    const saved = await notice.save();
    res.status(201).json({ data: saved });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT update notice by ID
router.put("/:id", async (req, res) => {
  try {
    const updated = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Notice not found" });
    res.status(200).json({ data: updated });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE notice by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Notice.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Notice not found" });
    res.status(200).json({ message: "Notice deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
