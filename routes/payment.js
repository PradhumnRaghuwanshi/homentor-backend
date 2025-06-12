const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const axios = require("axios")

const merchantId = 'TEST-M220MIDZKK8US_25060';
const saltKey = 'YOUR_SALT_KEY';
const saltIndex = 'YOUR_SALT_INDEX'; // usually "1"

router.post('/phonepe/pay', async (req, res) => {
    const { amount, name, email, phone } = req.body;
  
    const payload = {
      merchantId,
      merchantTransactionId: `txn_${Date.now()}`,
      merchantUserId: phone,
      amount: amount * 100, // in paise
      redirectUrl: 'https://homentor.onrender.com/mentors',
      redirectMode: 'POST',
      callbackUrl: 'https://homentor.onrender.com/mentors',
      mobileNumber: phone,
      paymentInstrument: {
        type: 'UPI_INTENT'
      }
    };
  
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    const signature = crypto
      .createHmac('sha256', saltKey)
      .update(base64Payload + '/pg/v1/pay' + saltKey)
      .digest('hex');
  
    try {
      const response = await axios.post(
        'https://api.phonepe.com/apis/hermes/pg/v1/pay',
        { request: base64Payload },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-VERIFY': `${signature}###${saltIndex}`
          }
        }
      );
  
      if (response.data.success) {
        res.json({ redirectUrl: response.data.data.instrumentResponse.redirectInfo.url });
      } else {
        res.status(400).json({ error: 'Payment initiation failed' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Payment error' });
    }
  });

  module.exports = router