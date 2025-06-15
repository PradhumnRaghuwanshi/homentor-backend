const axios = require('axios');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

// Replace these with your actual production credentials
const merchantId = 'M220MIDZKK8US';
const saltKey = 'YWJkZjUyOGYtYjU4ZC00ZjAxLThmOTMtNjM3MmFmYmFiYTY0';
const saltIndex = 1;
const clientId = 'TEST-M220MIDZKK8US_25060';
const clientSecret = 'client_credentials';
const phonepeBaseUrl = 'https://api.phonepe.com';
const phonepeUatBaseUrl = 'https://api-preprod.phonepe.com';
const redirectAfterPayment = 'https://homentor.onrender.com/'; // Set your frontend callback

// Get token
async function getPhonePeToken() {
  const response = await axios.post(`${phonepeBaseUrl}/oauth/token`, {
    clientId,
    clientSecret,
    grantType: 'client_credentials',
  }, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
  console.log(response.data.token)
  return response.data.token;
}

// Create Order
async function createPhonePeOrder() {
  const token = await getPhonePeToken();

  const merchantOrderId = uuidv4();
  const amountInPaise = 50000; // Rs 500

  const payload = {
    merchantId,
    merchantTransactionId: merchantOrderId,
    amount: amountInPaise,
    merchantUserId: "user123",
    redirectUrl: redirectAfterPayment,
    redirectMode: "POST",
    paymentInstrument: {
      type: "PAY_PAGE"
    }
  };

  const payloadString = JSON.stringify(payload);
  const base64Payload = Buffer.from(payloadString).toString('base64');

  const stringToHash = `${base64Payload}/pg/v1/pay${saltKey}`;
  const xVerify = crypto.createHash('sha256').update(stringToHash).digest('hex') + '###' + saltIndex;

  const res = await axios.post(`${phonepeUatBaseUrl}/pg/v1/pay`, {
    request: base64Payload
  }, {
    headers: {
      'Content-Type': 'application/json',
      'X-VERIFY': xVerify,
      'X-CLIENT-ID': merchantId,
      'Authorization': `Bearer ${token}`
    }
  });

  const redirectUrl = res.data.data.instrumentResponse.redirectInfo.url;

  return { redirectUrl };
}

module.exports = { createPhonePeOrder };
