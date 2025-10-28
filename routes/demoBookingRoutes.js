const express = require("express");
const DemoBooking = require("../models/DemoBooking");
const User = require("../models/User");

const router = express.Router();


// ✅ Create demo booking
router.post("/", async (req, res) => {
  try {
    const { mentorId, parentPhone, studentName, address, fee } = req.body;
    const booking = new DemoBooking({
      mentor: mentorId,
      parentPhone,
      studentName,
      address,
      fee,
    });

    await booking.save();

    const parent = await User.findOne({
      phone : parentPhone
    })

    if (!parent){
      parent = await User.create({
        phone : parentPhone
      })
    }

    const newBooking = new ClassBooking({
      mentor: mentorId,
      price: 0,
      parent: parent._id,
      duration : 2
    })
    await newBooking.save()

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
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
