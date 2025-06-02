const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();

router.post("/call", async (req, res) => {
  const { userNumber, mentorNumber } = req.body;

  try {
    const response = await axios.post(
      `https://${process.env.EXOTEL_API_KEY}:${process.env.EXOTEL_API_TOKEN}@api.exotel.com/v1/Accounts/${process.env.EXOTEL_SID}/Calls/connect.json`,
      new URLSearchParams({
        From: userNumber,
        To: mentorNumber,
        CallerId: process.env.EXOTEL_VIRTUAL_NUMBER,
        CallType: "trans",
        TimeLimit: "600",
        TimeOut: "30",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error("Exotel Call Error:", error?.response?.data || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
