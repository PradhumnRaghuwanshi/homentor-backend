const express = require("express");
const router = express.Router();

const CallIntent = require("../models/CallIntent");

/**
 * 🔹 Create Call Intent
 * Used when parent clicks "Call Mentor"
 */
router.post("/create", async (req, res) => {
  try {
    const { parentPhone, mentorPhone, mentorId } = req.body;

    if (!parentPhone || !mentorPhone) {
      return res.status(400).json({
        success: false,
        message: "parentPhone and mentorPhone are required",
      });
    }

    const callIntent = await CallIntent.create({
      parentPhone,
      mentorPhone,
      mentorId: mentorId || null,
      status: "initiated",
    });

    return res.status(201).json({
      success: true,
      data: callIntent,
    });
  } catch (error) {
    console.error("Create CallIntent Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create call intent",
    });
  }
});

/**
 * 🔹 Get Call Intent by Parent Phone
 * Used by Exotel webhook to validate call
 */
router.get("/by-parent/:phone", async (req, res) => {
  try {
    const { phone } = req.params;

    const callIntent = await CallIntent.findOne({
      parentPhone: phone,
    }).sort({ createdAt: -1 });

    if (!callIntent) {
      return res.status(404).json({
        success: false,
        message: "Call intent not found or expired",
      });
    }

    return res.json({
      success: true,
      data: callIntent,
    });
  } catch (error) {
    console.error("Fetch CallIntent Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching call intent",
    });
  }
});

/**
 * 🔹 Update Call Status
 * Used after Exotel callback (connected / missed / failed)
 */
router.patch("/status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ["initiated", "connected", "missed", "failed"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const updatedIntent = await CallIntent.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedIntent) {
      return res.status(404).json({
        success: false,
        message: "Call intent not found",
      });
    }

    return res.json({
      success: true,
      data: updatedIntent,
    });
  } catch (error) {
    console.error("Update CallIntent Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update call status",
    });
  }
});

/**
 * 🔹 Admin / Debug: Get all call intents
 */
router.get("/all", async (req, res) => {
  try {
    const intents = await CallIntent.find()
      .sort({ createdAt: -1 })
      .limit(100);

    return res.json({
      success: true,
      count: intents.length,
      data: intents,
    });
  } catch (error) {
    console.error("Fetch All CallIntents Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch call intents",
    });
  }
});

module.exports = router;
