const express = require("express");
const axios = require("axios");
const CallIntent = require("../models/CallIntent");
const MentorLead = require("../models/MentorLead");
const CallLog = require("../models/CallLog");
const router = express.Router();

router.get("/exotel-calls", async (req, res) => {
  try {
    const {
      EXOTEL_API_KEY,
      EXOTEL_API_TOKEN,
      EXOTEL_ACCOUNT_SID
    } = process.env;

    if (!EXOTEL_API_KEY || !EXOTEL_API_TOKEN || !EXOTEL_ACCOUNT_SID) {
      return res.status(500).json({
        success: false,
        message: "Exotel environment variables missing"
      });
    }

    // 🇮🇳 Mumbai cluster (use this for India accounts)
    const BASE_URL = "https://ccm-api.exotel.com";
    const BASE_URL2 = "https://api.exotel.com";
    const url = `${BASE_URL2}/v1/Accounts/${EXOTEL_ACCOUNT_SID}/Calls`;

    const response = await axios.get(url, {
      auth: {
        username: EXOTEL_API_KEY,
        password: EXOTEL_API_TOKEN
      },
      params: {
        per_page: 20,     // last 20 calls
        sort: "desc"
      }
    });

    res.json({
      success: true,
      calls: response.data?.calls || ["ok"]
    });

  } catch (error) {
    console.error("❌ Exotel fetch error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message
    });
  }
});


router.post("/call/initiate", async (req, res) => {
  const { parentPhone, mentorId, mentorPhone } = req.body;

  await CallIntent.create({
    parentPhone,
    mentorId,
    mentorPhone: mentorPhone,
    createdAt: new Date(),
    statusCallbackUrl: "https://homentor-backend.onrender.com/api/exotel/call-status"
  });
  res.json({ success: true });
});

function normalizePhone(phone) {
  if (!phone) return null;
  return phone
    .toString()
    .replace(/\D/g, "")     // remove non-digits
    .replace(/^0+/, "")     // remove leading zeros
    .slice(-10);            // keep last 10 digits
}

router.get("/get-mentor-number", async (req, res) => {
  const rawParentNumber =
    req.body.From ||
    req.query.From ||
    req.body.from;

  const parentNumber = normalizePhone(rawParentNumber);
  console.log("Parent calling number:", parentNumber);

  // Find latest intent (within 5 minutes)
  const intent = await CallIntent.findOne({
    parentPhone: rawParentNumber
  }).sort({ createdAt: -1 });
  console.log("intent ", intent)

  let lead = await MentorLead.findOne({
    phone: intent.mentorPhone
  })
  if (lead) {
    lead.isCalled = true
    lead.status = "call_done"
    await lead.save()
  }

  console.log(intent)

  res.set("Content-Type", "text/xml");
  res.send(`
    <Response>
      <Dial>${intent.mentorPhone}</Dial>
    </Response>
  `);
});

router.post("/call-status", async (req, res) => {
  try {
    const data = req.body;
    console.log("📞 Exotel Call Status:", data);

    const callSid = data.CallSid || data.call_sid;
    const status = data.CallStatus || data.Status;
    const duration = data.Duration ? Number(data.Duration) : 0;
    const recordingUrl = data.RecordingUrl;
    const disconnectReason = data.DisconnectReason;
    const parentPhone = normalizePhone(data.From);
    const mentorPhone = normalizePhone(data.To);

    // 🔍 Find existing log or create new
    let callLog = await CallLog.findOne({ callSid });

    if (!callLog) {
      callLog = new CallLog({
        callSid,
        parentPhone,
        mentorPhone,
      });
    }

    callLog.status = status;
    callLog.duration = duration || callLog.duration;
    callLog.recordingUrl = recordingUrl || callLog.recordingUrl;
    callLog.disconnectReason = disconnectReason;
    callLog.rawExotelData = data;

    await callLog.save();

    // 🔁 OPTIONAL: update CallIntent (if still exists)
    if (parentPhone) {
      const intent = await CallIntent.findOne({
        parentPhone,
      }).sort({ createdAt: -1 });

      if (intent) {
        intent.status =
          status === "completed" ? "connected" : "failed";
        await intent.save();
      }
    }

    // 🚨 ALWAYS 200 for Exotel
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ CallLog Error:", err);
    res.sendStatus(200);
  }
});



module.exports = router;
