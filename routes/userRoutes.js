const express = require("express");
const router = express.Router();
const User = require("../models/User");


router.post("/save-fcm-token", async (req, res) => {
  const { userId, token } = req.body;

  await User.findByIdAndUpdate(userId, { fcmToken: token });

  res.json({ success: true });
});

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET single user
router.post("/login-check", async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.body.phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET single user
router.post("/verify-check", async (req, res) => {
  const { verificationId, code } = req.body;
  const token =
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDLTNGMkU1OTlEMDkzRDRDNCIsImlhdCI6MTc1MDU5MjAyMywiZXhwIjoxOTA4MjcyMDIzfQ.CU0VtNuJu5MzHoSh-ItvVdeYEQqURgRTHymtUtuka-S6fxqzfuLPM8KgoVIMiCc965oZjw-XoKvSPQZhk00S4g";

  const url = "https://cpaas.messagecentral.com/verification/v3/validateOtp";
  const params = {
    verificationId,
    code,
    langId: "en",
  };
  try {
    const response = await axios.get(url, {
      params,
      headers: {
        authToken: token,
      },
    });
    res.status(200).json({
      message: "OTP verified",
      verificationStatus: response.data.data.verificationStatus,
    });
  } catch (err) {
    console.error("OTP validation failed:", err.response?.data || err.message);
    throw new Error("OTP validation failed");
  }
});

// CREATE user
router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      gender,
      phoneNumber,
      roomAllocated,
      feeStatus,
      detailPhotos,
    } = req.body;

    const newUser = new User({
      name,
      email,
      password,
      gender,
      phoneNumber,
      roomAllocated: roomAllocated || null,
      feeStatus: feeStatus || "unpaid",
      detailPhotos: {
        rentAgreement: detailPhotos?.rentAgreement || [],
        aadharPhotos: detailPhotos?.aadharPhotos || [],
        passportPhoto: detailPhotos?.passportPhoto || "",
      },
    });

    const room = await Room.findById(roomAllocated);

    if (!room) {
      return res.status(404).json({ message: "Room Not Found" });
    }

    if (room.capacity > room.occupied) {
      await newUser.save();
    } else {
      return res.status(404).json({ message: "Room is fully occupied" });
    }

    room.occupied = room.occupied + 1;
    room.currentRentStatus.rentDue = room.rent;
    room.currentRentStatus.totalRent = room.rent;
    await room.save();

    res.status(201).json({ data: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE user
router.put("/:id", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ data: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE user
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN (email/password)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.password !== password)
      return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        roomAllocated: user.roomAllocated,
        phoneNumber: user.phoneNumber,
        feeStatus: user.feeStatus,
        detailPhotos: user.detailPhotos,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// LOGOUT (dummy handler)
router.post("/logout", (req, res) => {
  req.session?.destroy?.(() => {
    res.status(200).json({ message: "Logout successful" });
  });
});

router.put("/accept-disclaimer/:id", async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, {
    disclaimerAccepted: true,
    disclaimers: req.body.disclaimers,
  });

  res.json({ success: true });
});

module.exports = router;
