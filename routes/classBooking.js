// routes/classBookingRoutes.js
const express = require("express");
const router = express.Router();
const ClassBooking = require("../models/ClassBooking");
const mongoose = require("mongoose");
const User = require("../models/User");
const Mentor = require("../models/Mentor");

// Get all class bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await ClassBooking.find()
      .populate("mentor", "fullName email phone teachingModes") // populate only required fields
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

router.post("/manual-booking", async (req, res) => {
  try {
    const { phone, address, ...bookingData } = req.body;

    // 1️⃣ Check if user already exists
    let user = await User.findOne({ phone });

    // 2️⃣ If user does NOT exist, create it
    if (!user) {
      user = new User({
        phone,
        address: {
          street: address.street,
          city: address.city,
          state: address.state,
          pincode: address.pincode
        },
      });
      await user.save();

    } else {
      // 3️⃣ If user exists, update address
      user.address = {
        street: address.street,
        city: address.city,
        state: address.state,
        pincode: address.pincode
      };
      await user.save();
    }

    // 4️⃣ Create booking linked to user
    const newBooking = new ClassBooking({
      ...bookingData,
      parent: user._id, // LINK booking to user
      mentor: req.body.mentorId,
      status: "scheduled",
      duration: req.body.duration,
      price: req.body.amount,
      session: 1,
      class: req.body.className,
      scheduledTime: req.body.time,
      scheduledDate: req.body.date
    });

    const savedBooking = await newBooking.save();

    // 5️⃣ Send success response
    res.status(201).json({
      success: true,
      message: "Booking done successfully",
      booking: savedBooking,
      parent: user,
    });

  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ success: false, message: error.message });
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid mentor ID" });
    }

    // 1️⃣ Active bookings (current mentor)
    const activeBookings = await ClassBooking.find({
      mentor: id,
      sessionContinued: false
    })
      .populate("parent", "phone address")
      .sort({ createdAt: -1 });

    const mentorObjectId = new mongoose.Types.ObjectId(id);

    // 2️⃣ History bookings (old mentor)
    const historyBookings = await ClassBooking.find({
      teacherHistory: {
        $elemMatch: {
          teacherId: mentorObjectId
        }
      }
    })
      .populate("parent", "phone address")
      .sort({ createdAt: -1 });
    console.log(historyBookings)
    if (
      activeBookings.length === 0 &&
      historyBookings.length === 0
    ) {
      return res.status(404).json({
        success: false,
        message: "No bookings found"
      });
    }

    res.status(200).json({
      success: true,
      data: [
        ...activeBookings,
        ...historyBookings
      ]
    });
  } catch (error) {
    console.error("Error fetching mentor bookings:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});


router.get("/student/:id", async (req, res) => {
  try {
    const booking = await ClassBooking.find({
      parent: req.params.id,
      sessionContinued: false
    }).populate("mentor", "fullName profilePhoto phone teachingModes backupTeachers").sort({ createdAt: -1 });;
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

    // ✅ All classes finished → allow parent confirmation
    booking.parentCompletion = !booking.parentCompletion;
    booking.status = "completed";
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

router.post("/:id/admin-approve", async (req, res) => {
  try {
    const booking = await ClassBooking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Not found" });

    // ✅ All classes finished → allow parent confirmation
    booking.adminApproved = !booking.adminApproved;
    await booking.save();

    res.json({
      success: true,
      message: "Admin Approved saved successfully",
      data: booking,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/:id/mentor-complete", async (req, res) => {
  try {
    const booking = await ClassBooking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Not found" });


    // Check if classes completed
    const totalClasses = Number(booking.duration);  // usually 22
    const completed = Math.floor(booking.progress / 60);
    const remaining = totalClasses - completed;

    // ❌ If classes are not fully completed
    if (remaining > 0) {
      return res.status(400).json({
        success: false,
        message: `${remaining} classes are remaining`,
      });
    }

    // ✅ All classes finished → allow parent confirmation
    booking.mentorCompletion = !booking.mentorCompletion;
    if (booking.demoStatus == "running") {
      booking.demoStatus = "completed"
    }

    await booking.save();

    res.json({
      success: true,
      message: "Mentor confirmation saved successfully",
      data: booking,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/class-bookings/:id/terminate
router.post("/:id/terminate", async (req, res) => {
  try {
    const booking = await ClassBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const totalClasses = Number(booking.duration) || 22;
    const refundAmount = req.body.refundableAmount;
    booking.status = "terminated";
    booking.refundAmount = refundAmount;
    booking.terminatedAt = new Date();

    await booking.save();

    res.json({
      success: true,
      refundAmount,
      message: "Teacher terminated successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/:id/change-teacher", async (req, res) => {
  try {
    const { newTeacherId, newTeacherMonthlyPrice } = req.body;

    const booking = await ClassBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    const oldMentorId = booking.mentor;

    // 🔹 TOTAL NET MONEY
    const netAmount = booking.price - booking.commissionPrice;

    // 🔹 OLD MENTOR PRICE PER CLASS
    const oldPerClass = booking.currentPerClassPrice;

    // 🔹 CLASSES ALREADY DONE
    const classesCompleted = booking.progress; // count of classes

    // 🔹 MONEY CONSUMED SO FAR
    const moneyConsumedSoFar =
      booking.teacherHistory.reduce((sum, h) => sum + h.amountToPay, 0) +
      (classesCompleted - booking.teacherHistory.reduce((s, h) => s + h.classesTaken, 0)) * oldPerClass;

    // 🔹 REMAINING MONEY
    const remainingMoney = Math.max(netAmount - moneyConsumedSoFar, 0);

    // 🔹 NEW MENTOR PRICE
    const newPerClass = newTeacherMonthlyPrice / 22;

    // 🔹 CALCULATE NEW REMAINING CLASSES
    const remainingClasses = Math.max(Math.floor(remainingMoney / newPerClass), 1);

    // 🔹 PUSH OLD MENTOR HISTORY
    const oldMentor = await Mentor.findById(oldMentorId);

    const oldMentorClasses =
      classesCompleted -
      booking.teacherHistory.reduce((s, h) => s + h.classesTaken, 0);

    if (oldMentorClasses > 0) {
      booking.teacherHistory.push({
        teacherId: oldMentorId,
        fullName: oldMentor.fullName,
        phone: oldMentor.phone,
        perClassPrice: oldPerClass,
        classesTaken: oldMentorClasses,
        amountToPay: oldMentorClasses * oldPerClass,
        switchedAt: new Date(),
      });
    }

    // 🔹 UPDATE BOOKING
    booking.mentor = newTeacherId;
    booking.currentPerClassPrice = newPerClass;
    booking.remainingClasses = remainingClasses;

    await booking.save();

    res.json({
      success: true,
      remainingMoney,
      remainingClasses,
      newPerClass,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});







module.exports = router;
