const express = require("express");
const DemoBooking = require("../models/DemoBooking");
const User = require("../models/User");
const ClassBooking = require("../models/ClassBooking");
const MentorLead = require("../models/MentorLead");
const ParentLead = require("../models/ParentLead");

const router = express.Router();


// ✅ Create demo booking
router.post("/", async (req, res) => {
  try {
    console.log(req.body);

    const { mentorId, parentPhone, studentName, address, fee } = req.body;

    // Save demo booking
    const booking = await DemoBooking.create({
      mentor: mentorId,
      parentPhone,
      studentName,
      address,
      fee
    });

    // Find or create parent
    let parent = await User.findOne({ phone: parentPhone });

    if (!parent) {
      parent = await User.create({ phone: parentPhone });
    }

    // Create main class booking
    const newBooking = await ClassBooking.create({
      mentor: mentorId,
      price: 0,
      parent: parent._id,
      duration: 2,
      isDemo: true,
      demoStatus: "running"
    });

    let lead = await MentorLead.findOne({
      phone: req.body.mentorPhone
    })

    if (lead) {
      lead.demoBooked = true
      lead.status = "demo_booked"
      await lead.save()
    }

    let parentLead = await ParentLead.findOne({
      phone: parentPhone
    })
    if (parentLead) {
      parentLead.demoBooked = true
      parentLead.status = "demo_booked"
      parentLead.lastActive = new Date(),
      parentLead.lastActivityText = "Demo Booking"
      await parentLead.save()
    }

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: {
        demoBooking: booking,
        classBooking: newBooking,
      },
    });

  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});


// ✅ Get all demo bookings (for admin)
router.get("/", async (req, res) => {
  try {
    const bookings = await DemoBooking.find()
      .populate("mentor", "fullName phone profilePhoto")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Update status of a demo booking
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await DemoBooking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Delete a booking (optional)
router.delete("/:id", async (req, res) => {
  try {
    await DemoBooking.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Booking deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
