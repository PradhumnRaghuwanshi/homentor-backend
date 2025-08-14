// routes/classBookingRoutes.js
const express = require("express");
const router = express.Router();
const ClassBooking = require("../models/ClassBooking");

// @desc    Get all class bookings
// @route   GET /api/class-bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await ClassBooking.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// @desc    Create new class booking
// @route   POST /api/class-bookings
router.post("/", async (req, res) => {
  try {
    const newBooking = new ClassBooking(req.body);
    const savedBooking = await newBooking.save();
    res.status(201).json({ success: true, data: savedBooking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   GET /api/class-bookings/:id
router.get("/:id", async (req, res) => {
  try {
    const booking = await ClassBooking.findById(req.params.id);
    if (!booking)
      return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});
router.put("/booking/:id", async (req, res) => {
  try {
    const booking = await ClassBooking.findByIdAndUpdate(req.params.id, req.body);
    if (!booking)
      return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});
router.get("/mentor/:id", async (req, res) => {
  try {
    const booking = await ClassBooking.find({
      mentor : req.params.id
    }).populate("parent", "phone")
    if (!booking)
      return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get("/student/:id", async (req, res) => {
  try {
    const booking = await ClassBooking.find({
      parent : req.params.id
    }).populate("mentor", "fullName profilePhoto");
    if (!booking)
      return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});


module.exports = router;
