const https = require('https');

const data = JSON.stringify({
  merchantOrderId: 'TX123456',
  amount: 100,
  expireAfter: 1200,
  paymentFlow: {
    type: 'PG_CHECKOUT'
  }
});

const options = {
  hostname: 'api-preprod.phonepe.com',
  path: '/apis/pg-sandbox/pg/v1/order/token',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'O-Bearer <your-access-token-here>',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  console.log(`✅ Status Code: ${res.statusCode}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log('📦 Response:', chunk);
  });
});

req.on('error', (e) => {
  console.error(`❌ Problem: ${e.message}`);
});

req.write(data);
req.end();
