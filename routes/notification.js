const express = require("express");
const router = express.Router();
const sendWhatsappMessage = require("../utils/sendWhatsapp");

router.post("/send-whatsapp", async (req, res) => {
  try {
    const { phone, studentName, mentorName, date, time } = req.body;

    await sendWhatsappMessage({
      to: phone, // +91XXXXXXXXXX
      templateName: "booking", // 👈 must match Exotel approved template
      bodyParams: [
        studentName,
        mentorName,
        date,
        time,
      ],
    });

    res.json({
      success: true,
      message: "WhatsApp template message sent successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to send WhatsApp message",
    });
  }
});

module.exports = router;
