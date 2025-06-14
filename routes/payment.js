// paymentRoutes.js
const express = require("express");
const {
  StandardCheckoutClient,
  Env,
  CreateSdkOrderRequest,
  StandardCheckoutPayRequest,
} = require("pg-sdk-node");
const { randomUUID } = require("crypto");

const router = express.Router();

// Replace with actual values from PhonePe dashboard
const clientId = "SU2506131953474258261009";
const clientSecret = "acef75c8-4bfa-48bd-a763-965912f259a0";
const clientVersion = 1;
const env = Env.PRODUCTION; // Change to Env.PRODUCTION for live

const client = StandardCheckoutClient.getInstance(
  clientId,
  clientSecret,
  clientVersion,
  env
);

// Endpoint to create a payment order
router.post('/create-order', async (req, res) => {
  try {
    const { name, email, phone, amount } = req.body;

    const transactionId = 'TXN_' + Date.now();
    const redirectUrl = `https://homentor.onrender.com/payment-success`;
    const callbackUrl = `https://homentor.onrender.com/payment-callback`;

    const payload = {
      merchantId: "SU2506131953474258261009",
      merchantTransactionId: transactionId,
      merchantUserId: phone,
      amount: amount * 100, // Convert to paise
      redirectUrl,
      redirectMode: 'REDIRECT',
      callbackUrl,
      mobileNumber: phone,
      paymentInstrument: {
        type: 'PAY_PAGE',
      },
    };

    const payloadStr = JSON.stringify(payload);
    const base64Payload = Buffer.from(payloadStr).toString('base64');

    const dataToHash = base64Payload + '/pg/v1/pay' + 'acef75c8-4bfa-48bd-a763-965912f259a0';
    const checksum = crypto.createHash('sha256').update(dataToHash).digest('hex');
    const xVerify = `${checksum}###${1}`;
    console.log(payload)
    const response = await axios.post(
      `https://api.phonepe.com/apis/hermes/pg/v1/pay`,
      { request: base64Payload },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': xVerify,
        },
      }
    );

    const { data } = response.data;
    res.json({ success: true, redirectUrl: data.instrumentResponse.redirectInfo.url });
  } catch (error) {
    console.error('PhonePe payment error:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: 'Payment initiation failed.' });
  }
});

module.exports = router;
