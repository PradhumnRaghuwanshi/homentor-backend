const express = require("express");
const router = express.Router();
const Expenses = require("../models/Expenses");

// Get all bills
router.get("/", async (req, res) => {
  try {
    const expenses = await Expenses.find().sort({ date: -1 });
    res.status(200).json({ data: expenses });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get bill by ID
router.get("/:id", async (req, res) => {
  try {
    const bill = await Expenses.findById(req.params.id);
    if (!bill) return res.status(404).json({ message: "Bill not found" });
    res.status(200).json({ data: bill });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create new bill
router.post("/", async (req, res) => {
  try {
    const newBill = new Expenses(req.body);
    const saved = await newBill.save();
    res.status(201).json({ data: saved });
  } catch (err) {
    console.error("POST error:", err);
    res.status(500).json({ message: "Failed to add bill" });
  }
});

// Update bill
router.put("/:id", async (req, res) => {
  try {
    const updated = await Expenses.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Bill not found" });
    res.status(200).json({ data: updated });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete bill
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Expenses.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Bill not found" });
    res.status(200).json({ message: "Bill deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
