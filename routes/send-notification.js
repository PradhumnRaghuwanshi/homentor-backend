const admin = require("../firebase");
const express = require("express")
const router = express.Router()

router.post("/send-notification", async (req, res) => {
  try {
    const { userId, title, body } = req.body;

    const user = await User.findById(userId);
    if (!user?.fcmToken) {
      return res.status(400).json({ message: "User does not have token" });
    }

    const message = {
      token: user.fcmToken,
      notification: { title, body }
    };

    const response = await admin.messaging().send(message);

    res.json({ success: true, response });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router
