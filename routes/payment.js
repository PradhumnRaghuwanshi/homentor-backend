// paymentRoutes.js
const express = require('express')
const { StandardCheckoutClient, Env, CreateSdkOrderRequest } = require('pg-sdk-node');
const { randomUUID } = require('crypto');

const router = express.Router();

// Replace with actual values from PhonePe dashboard
const clientId = "TEST-M220MIDZKK8US_25060";
const clientSecret = "YWJkZjUyOGYtYjU4ZC00ZjAxLThmOTMtNjM3MmFmYmFiYTY0";
const clientVersion = 1;
const env = Env.SANDBOX; // Change to Env.PRODUCTION for live

const client = StandardCheckoutClient.getInstance(clientId, clientSecret, clientVersion, env);

// Endpoint to create a payment order
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const merchantOrderId = randomUUID();
    const redirectUrl = "https://homentor.onrender.com"; // Update to your actual redirect URL

    const request = CreateSdkOrderRequest.StandardCheckoutBuilder()
      .merchantOrderId(merchantOrderId)
      .amount(amount)
      .redirectUrl(redirectUrl)
      .build();

    const response = await client.createSdkOrder(request);

    res.json({
      success: true,
      token: response.token,
      merchantOrderId,
      redirectUrl: `https://mercury-uat.phonepe.com/transact/uat_v2?token=${response.token}`,
    });
  } catch (error) {
    console.error("PhonePe order creation failed:", error);
    res.status(500).json({ success: false, message: "Failed to create order", error });
  }
});

module.exports = router