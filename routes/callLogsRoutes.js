const express = require("express");
const router = express.Router();
const CallLog = require("../models/CallLog");

router.get("/", async (req, res) => {
  try {
    const logs = await CallLog.find()
      .sort({ startTime: -1 }); // latest first

    res.json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (error) {
    console.error("CallLog fetch error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
