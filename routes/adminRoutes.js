const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const ClassBooking = require("../models/ClassBooking");
const Mentor = require("../models/Mentor");
const CallLog = require("../models/CallLog");

// GET admin by ID
router.get("/:id", async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ data: admin });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// CREATE new admin (Admin can create students)
router.post("/", async (req, res) => {
  try {

    // Create a new Admin
    const newAdmin = new Admin(req.body);

    // Save the new admin to the database
    const savedAdmin = await newAdmin.save();
    res.status(201).json({ data: savedAdmin });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// UPDATE admin (Admin can update admin details)
router.put("/:id", async (req, res) => {
  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ data: updatedAdmin });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// DELETE admin (Admin can delete a student)
router.delete("/:id", async (req, res) => {
  try {
    const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// LOGIN route (for student login)
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Compare plain text password with stored password
    if (admin.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Successfully logged in
    res.status(200).json({
      message: "Login successful",
      admin: admin,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// LOGOUT route (student logout)
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to logout" });
    }
    res.status(200).json({ message: "Logout successful" });
  });
});

router.get("/", async (req, res) => {
  try {
    console.log("Counting")
    // const bookings = await ClassBooking.countDocuments({
    //   isViewedByAdmin: false,
    // });
    // console.log(bookings)
    // const calls = await CallLog.countDocuments({
    //   isViewedByAdmin: false,
    // });

    // const mentorRequests = await Mentor.countDocuments({
    //   isViewedByAdmin: false,
    // });

    // res.json({
    //   bookings,
    //   calls,
    //   mentorRequests,
    // });
    const bookings = await ClassBooking.find({
      isViewedByAdmin: false
    })
    res.status(200).json(bookings.length)

  } catch (error) {
    console.error("❌ Sidebar-counts error:", error);

    res.status(500).json({
      message: "Sidebar counts failed",
      error: error.message,
    });
  }
});



module.exports = router;
