const express = require("express");
const axios = require("axios");
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

/* ===========================
   ROUTE: INITIATE CALL
=========================== */

router.post("/call", async (req, res) => {
  try {
    const {
      mentorNumber,
      parentNumber,
      virtualNumber,
      bookingId
    } = req.body;

    if (!mentorNumber || !parentNumber || !virtualNumber) {
      return res.status(400).json({
        success: false,
        message: "mentorNumber, parentNumber and virtualNumber are required"
      });
    }

    const result = await makeOutgoingCall({
      fromNumber: mentorNumber,
      toNumber: parentNumber,
      virtualNumber,
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

/* ===========================
   ROUTE: STATUS CALLBACK
=========================== */

router.post("/callback", (req, res) => {
  console.log("📞 Exotel Callback:");
  console.log(JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

module.exports = router;
