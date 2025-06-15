// paymentRoutes.js
const express = require("express");
const crypto = require("crypto");
const router = express.Router();

const MERCHANT_ID = "TEST-M220MIDZKK8US_25060";
const SALT_KEY = "YWJkZjUyOGYtYjU4ZC00ZjAxLThmOTMtNjM3MmFmYmFiYTY0";
const SALT_INDEX = 1;
const BASE_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";

const {
  StandardCheckoutClient,
  Env,
  CreateSdkOrderRequest,
} = require("pg-sdk-node");
const { randomUUID } = require("crypto");
const { default: Response } = require("twilio/lib/http/response");

// Replace with actual values from PhonePe dashboard
const clientId = "TEST-M220MIDZKK8US_25060";
const clientSecret = "YWJkZjUyOGYtYjU4ZC00ZjAxLThmOTMtNjM3MmFmYmFiYTY0";
const clientVersion = 1;
const env = Env.SANDBOX; // Change to Env.PRODUCTION for live

const client = StandardCheckoutClient.getInstance(
  clientId,
  clientSecret,
  clientVersion,
  env
);

// Endpoint to create a payment order
router.post("/create-order", async (req, res) => {
  const { name, email, phone, amount } = req.body;

    const payload = {
      merchantId: MERCHANT_ID,
      merchantTransactionId: `MT${Date.now()}`,
      merchantUserId: "MUID123",
      amount:  1000, // Convert to paise
      redirectUrl: "https://homentor.onrender.com/", // replace with your redirect URL
      redirectMode: "REDIRECT",
      callbackUrl: "https://homentor.onrender.com/", // replace with your callback URL
      mobileNumber: 9630709988,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    const stringToSign = base64Payload + `/pg/v1/pay` + SALT_KEY;
    const xVerify = crypto.createHash('sha256').update(stringToSign).digest('hex') + `###${SALT_INDEX}`;

    try {

    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify,
        'X-MERCHANT-ID': MERCHANT_ID
      },
      body: JSON.stringify({ request: base64Payload })
    });
    const data = await response.json();
    res.json(data);
    
  } catch (error) {
    console.error("PhonePe order creation failed:", error);
   res.status(500).json({ message: 'Payment initiation failed', error: err.message });
  }
});

module.exports = router;
