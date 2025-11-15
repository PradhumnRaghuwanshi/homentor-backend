// routes/classBookingRoutes.js
const express = require("express");
const router = express.Router();
const ClassBooking = require("../models/ClassBooking");
const mongoose = require("mongoose");
const User = require("../models/User");

// Get all class bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await ClassBooking.find()
      .populate("mentor", "fullName email phone") // populate only required fields
      .populate("parent", "fullName phone")       // populate only required fields
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// POST /api/class-bookings
router.post("/", async (req, res) => {
  try {
    const newBooking = new ClassBooking(req.body);
    const savedBooking = await newBooking.save();
    res.status(201).json({ success: true, data: savedBooking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post("/cash-booking", async (req, res) => {
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
    const { id } = req.params;
    console.log("Mentor ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid mentor ID" });
    }

    const booking = await ClassBooking.find({ mentor: id }).populate("parent", "phone address");

    if (!booking || booking.length === 0) {
      return res.status(404).json({ success: false, message: "No bookings found" });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    console.error("Error fetching bookings:", error); // log the actual error
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get("/student/:id", async (req, res) => {
  try {
    const booking = await ClassBooking.find({
      parent : req.params.id
    }).populate("mentor", "fullName profilePhoto phone");
    if (!booking)
      return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// DELETE a booking by ID
router.delete("/:id", async (req, res) => {
  try {
    const booking = await ClassBooking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.post("/:id/parent-complete", async (req, res) => {
  try {
    const booking = await ClassBooking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Not found" });

    // Check if classes completed
    const totalClasses = Number(booking.duration);  // usually 22
    const completed = booking.progress;
    const remaining = totalClasses - completed;

    // ❌ If classes are not fully completed
    if (remaining > 0) {
      return res.status(400).json({
        success: false,
        message: `${remaining} classes are remaining`,
      });
    }

    // ✅ All classes finished → allow parent confirmation
    booking.parentCompletion = true;
    await booking.save();

    res.json({
      success: true,
      message: "Parent confirmation saved successfully",
      data: booking,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;
