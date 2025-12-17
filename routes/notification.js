const express = require("express");
const router = express.Router();
const sendWhatsappMessage = require("../utils/sendWhatsapp");

router.post("/send-whatsapp", async (req, res) => {
  try {
    const { phone, message } = req.body;

    await sendWhatsappMessage({
      to: phone,
      message: message,
      customData: "booking_notification"
    });

    res.json({
      success: true,
      message: "WhatsApp message sent successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send WhatsApp message"
    });
  }
});

module.exports = router;
