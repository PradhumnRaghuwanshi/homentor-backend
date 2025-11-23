const admin = require("../firebase");
const express = require("express");
const router = express.Router();
const User = require("../models/User"); // ✔️ Import User model
const mongoose = require("mongoose"); // ✔️ For ObjectId validation

router.post("/send-notification", async (req, res) => {
  try {
    const { userId, title, body } = req.body;

    // ✔️ Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    // ✔️ Find user correctly
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.fcmToken) {
      return res.status(400).json({ message: "User does not have FCM token" });
    }

    // ✔️ Construct message
    const message = {
      token: user.fcmToken,
      notification: { title, body }
    };

    // ✔️ Send push notification
    const response = await admin.messaging().send(message);

    res.json({ success: true, response });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
