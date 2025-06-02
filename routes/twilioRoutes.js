// twilioRoutes.js or in your Express route file
const express = require('express')
const twilio = require('twilio')

const router = express.Router();
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

router.post("/call", async (req, res) => {
  const { parentNumber, mentorNumber } = req.body;

  if (!parentNumber || !mentorNumber) {
    return res.status(400).json({ error: "Phone numbers are required." });
  }

  try {
    const call = await client.calls.create({
      twiml: `<Response><Dial>${mentorNumber}</Dial></Response>`,
      to: parentNumber,
      from: process.env.TWILIO_PHONE_NUMBER,
    });

    res.status(200).json({ success: true, callSid: call.sid });
  } catch (error) {
    console.error("Twilio call error:", error);
    res.status(500).json({ success: false, error: "Call failed." });
  }
});

module.exports = router

