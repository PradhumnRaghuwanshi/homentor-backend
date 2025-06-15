const express = require('express');
const crypto = require('crypto');
const axios = require('axios');
const router = express.Router();

const merchantId = 'TEST-M220MIDZKK8US';
const clientSecret = 'YWJkZjUyOGYtYjU4ZC00ZjAxLThmOTMtNjM3MmFmYmFiYTY0';
const saltIndex = 1;

router.post('/create-order', async (req, res) => {
  const { amount, phone } = req.body;
  const merchantOrderId = 'ORDER_' + Date.now();

  const payload = {
    merchantOrderId,
    amount: amount * 100, // in paisa
    expireAfter: 1200,
    metaInfo: {
      udf1: phone
    },
    paymentFlow: {
      type: "PG_CHECKOUT"
    }
  };

  const jsonPayload = JSON.stringify(payload);
  const base64Payload = Buffer.from(jsonPayload).toString('base64');

  const stringToHash = base64Payload + '/pg/v1/order/token' + clientSecret;
  const xVerify = crypto.createHash('sha256').update(stringToHash).digest('hex') + '###' + saltIndex;

  try {
    const response = await axios.post(
      'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/order/token',
      base64Payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': xVerify,
          'X-MERCHANT-ID': merchantId,
          'Authorization': 'O-Bearer ' + base64Payload
        }
      }
    );

    const token = response.data?.data?.token;
    if (!token) {
      return res.status(500).json({ error: 'Token not generated', response: response.data });
    }

    const redirectUrl = `https://web.phonepe.com/test-merchant-simulator/pg/v1/pay/${token}`;

    return res.json({
      success: true,
      token,
      redirectUrl,
      orderId: merchantOrderId
    });
  } catch (error) {
    console.error("PhonePe Checkout Error:", error.response?.data || error.message);
    res.status(500).json({ error: 'PhonePe Token API failed', details: error.response?.data });
  }
});

module.exports = router;
