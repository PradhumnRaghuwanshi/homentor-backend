const express = require("express");
const axios = require("axios");
const CallIntent = require("../models/CallIntent");
const MentorLead = require("../models/MentorLead");
const router = express.Router();

const makeOutgoingCall = async ({
  fromNumber,
  toNumber,
  virtualNumber,
  customField,
  statusCallbackUrl
}) => {
  const {
    EXOTEL_API_KEY,
    EXOTEL_API_TOKEN,
    EXOTEL_ACCOUNT_SID
  } = process.env;

  if (!EXOTEL_API_KEY || !EXOTEL_API_TOKEN || !EXOTEL_ACCOUNT_SID) {
    throw new Error("Exotel environment variables missing");
  }

  const BASE_URL = "https://ccm-api.exotel.com"; // Singapore cluster
  const url = `${BASE_URL}/v3/accounts/${EXOTEL_ACCOUNT_SID}/calls`;

  const payload = {
    from: {
      contact_uri: fromNumber,
      state_management: true
    },
    to: {
      contact_uri: toNumber
    },
    virtual_number: virtualNumber,
    recording: {
      record: true,
      channels: "single"
    },
    max_time_limit: 4000,
    attempt_time_out: 45,
    custom_field: customField || "exotel_call",
    status_callback: statusCallbackUrl
      ? [
        {
          event: "terminal",
          url: statusCallbackUrl,
          method: "POST",
          content_type: "application/json"
        }
      ]
      : []
  };

  const response = await axios.post(url, payload, {
    auth: {
      username: EXOTEL_API_KEY,
      password: EXOTEL_API_TOKEN
    },
    headers: {
      "Content-Type": "application/json"
    }
  });

  return response.data;
};

router.post("/call", async (req, res) => {
  try {
    const {
      mentorNumber,
      parentNumber,
      bookingId
    } = req.body;

    if (!mentorNumber || !parentNumber) {
      return res.status(400).json({
        success: false,
        message: "mentorNumber, parentNumber and virtualNumber are required"
      });
    }

    await CallIntent.create({
    parentPhone,
    mentorId,
    mentorPhone: mentorPhone,
    createdAt: new Date()
  });

    const result = await makeOutgoingCall({
      fromNumber: mentorNumber,
      toNumber: parentNumber,
      virtualNumber: "+917314852387",
      customField: bookingId,
      statusCallbackUrl: "https://yourdomain.com/api/exotel/callback"
    });

    res.json({
      success: true,
      message: "Call initiated",
      data: result
    });
  } catch (error) {
    console.error("Exotel call error:", error);
    res.status(500).json({
      success: false,
      error
    });
  }
});


router.post("/call/initiate", async (req, res) => {
  const { parentPhone, mentorId, mentorPhone } = req.body;

  await CallIntent.create({
    parentPhone,
    mentorId,
    mentorPhone: mentorPhone,
    createdAt: new Date()
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

  lead.isCalled = true
  lead.status = "call_done"
  await lead.save()

  console.log(intent)

  res.set("Content-Type", "text/xml");
  res.send(`
    <Response>
      <Dial>${intent.mentorPhone}</Dial>
    </Response>
  `);
});


module.exports = router;
