const express = require('express');
const { randomUUID } = require('crypto');
const { StandardCheckoutClient, Env, CreateSdkOrderRequest } = require('pg-sdk-node');

const router = express.Router();

// 🔐 INSERT YOUR PHONEPE CREDENTIALS HERE
const clientId = 'SU2506131953474258261009';
const clientSecret = 'acef75c8-4bfa-48bd-a763-965912f259a0';
const clientVersion = 1; // Usually 1 or latest provided by PhonePe
const redirectUrl = 'https://homentor.onrender.com'; // Must be HTTPS
const env = Env.PRODUCTION; // Change to Env.PRODUCTION for testing

const client = StandardCheckoutClient.getInstance(clientId, clientSecret, clientVersion, env);

router.post('/create-order', async (req, res) => {
  try {
    const { amount, phone } = req.body;

    const merchantOrderId = randomUUID();

    const request = CreateSdkOrderRequest.StandardCheckoutBuilder()
      .merchantOrderId(merchantOrderId)
      .amount(amount * 100) // Convert ₹ to paise
      .redirectUrl(redirectUrl)
      .build();

    const response = await client.createSdkOrder(request);

    const token = response.token;
    const phonePeRedirectUrl = `https://api.phonepe.com/apis/pg/checkout/v2/sdk/order?token=${token}&merchantId=${clientId}`;

    return res.json({ success: true, redirectUrl: phonePeRedirectUrl });
  } catch (err) {
    console.error('PhonePe Error:', err.message || err);
    return res.status(500).json({
      success: false,
      message: 'Payment initiation failed',
      error: err.message || err,
    });
  }
});

module.exports = router;
