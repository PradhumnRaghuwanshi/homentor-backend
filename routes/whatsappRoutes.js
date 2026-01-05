const express = require("express");
const axios = require("axios");

const router = express.Router();


router.post("/send", async (req, res) => {
  try {
    // const { phone, message } = req.body;

    const url = `https://graph.facebook.com/v24.0/1036391139546786/messages`;

    const payload = {
      messaging_product: "whatsapp",
      "recipient_type": "individual",
      to: "919630709988",
      type: "text",
      text: {
        "preview_url": true,
        body: "message",
      },
    };

    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    return res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("WhatsApp API Error:", error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      error: error.response?.data || "Failed to send WhatsApp message",
    });
  }
});

module.exports = router;
