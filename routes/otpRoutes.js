const express = require("express");
const sendOtp = require("../utils/sendOtp");
const validateOtp = require("../utils/validateOtp");

const router = express.Router();

// Send OTP
router.post("/send-otp", async (req, res) => {
  const { mobile } = req.body;
  if (!mobile) return res.status(400).json({ message: "Mobile number required" });

  try {
    const data = await sendOtp(mobile);
    res.status(200).json({ message: "OTP sent", verificationId: data.data.verificationId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Validate OTP
router.post("/verify-otp", async (req, res) => {
  const { verificationId, code, phone } = req.body;

  if (!verificationId || !code)
    return res.status(400).json({ message: "verificationId and code are required" });

  try {
    const data = await validateOtp(verificationId, code, phone);
    res.status(200).json({ message: "OTP verified", verificationStatus: data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
