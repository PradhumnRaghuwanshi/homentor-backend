const express = require('express');
const crypto = require('crypto');
const axios = require('axios');
const router = express.Router();

// 🧪 Sandbox credentials (UAT)
const clientId = 'TEST-M220MIDZKK8US_25060';
const clientSecret = 'YWJkZjUyOGYtYjU4ZC00ZjAxLThmOTMtNjM3MmFmYmFiYTY0'; // salt key
const saltIndex = 1;
const merchantId = 'TEST-M220MIDZKK8US'; // Sandbox merchant ID
const redirectUrl = 'https://homentor.onrender.com';
const callbackUrl = 'https://homentor.onrender.com/payment-callback';

router.post('/create-order', async (req, res) => {
  const { phone, amount } = req.body;

  const merchantTransactionId = 'TXN_' + Date.now();

  const body = {
    merchantId,
    merchantTransactionId,
    merchantUserId: phone || 'user_' + Date.now(),
    amount: amount * 100,
    redirectUrl,
    redirectMode: 'POST',
    callbackUrl,
    paymentInstrument: { type: 'PAY_PAGE' }
  };

  const jsonBody = JSON.stringify(body);
  const base64Body = Buffer.from(jsonBody).toString('base64');

  try {
  const decoded = Buffer.from(base64Body, 'base64').toString('utf-8');
  JSON.parse(decoded); // 👈 this will throw error if JSON is malformed
  console.log("✅ Base64 is valid JSON");
} catch (err) {
  console.error("❌ Invalid Base64 or JSON:", err.message);
}

  const xVerify = crypto
    .createHash('sha256')
    .update(base64Body + '/checkout/v2/sdk/order' + clientSecret)
    .digest('hex') + '###' + saltIndex;

  console.log("🟢 JSON:", jsonBody);
  console.log("🟢 Base64:", base64Body);
  console.log("🟢 x-verify:", xVerify);

  try {
    const response = await axios.post(
      'https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/sdk/order',
      base64Body,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': xVerify,
          'X-CLIENT-ID': clientId
        },
        transformRequest: [(data) => data]
      }
    );

    const orderToken = response.data?.data?.instrumentResponse?.token;

    if (!orderToken) {
      return res.status(500).json({ error: 'Token not generated', response: response.data });
    }

    const paymentUrl = `https://web.phonepe.com/test-sdk/v3/pay?token=${orderToken}&merchantId=${merchantId}`;

    return res.json({
      success: true,
      redirectUrl: paymentUrl,
      merchantTransactionId
    });

  } catch (err) {
    console.error('❌ PhonePe error:', err.response?.data || err.message);
    return res.status(500).json({
      error: 'Failed to create PhonePe order',
      details: err.response?.data || err.message
    });
  }
});

module.exports = router;
