// twilioRoutes.js or in your Express route file
const express = require('express')
const twilio = require('twilio')

const router = express.Router();
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

router.post('/api/call', async (req, res) => {
  const { parentNumber, mentorNumber } = req.body;

  if (!parentNumber || !mentorNumber) {
    return res.status(400).json({ error: 'Missing numbers' });
  }

  try {
    const call = await client.calls.create({
      url: 'http://demo.twilio.com/docs/voice.xml', // TwiML instructions
      to: parentNumber,
      from: "+919630709988", // Must be a verified Twilio number
    });

    console.log('Call SID:', call.sid);
    res.status(200).json({ success: true, sid: call.sid });
  } catch (error) {
    console.error('Twilio call error:', error.message);
    res.status(500).json({ error: error.message });
  }
});


module.exports = router

