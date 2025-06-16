const {
  StandardCheckoutClient,
  Env,
  StandardCheckoutPayRequest,
} = require("pg-sdk-node");
const { randomUUID } = require("crypto");
const express = require('express')
const router = express.Router()
const clientSecret = "acef75c8-4bfa-48bd-a763-965912f259a0";
const clientVersion = 1;
const clientId = "SU2506131953474258261009";
const env = Env.PRODUCTION; //change to Env.PRODUCTION when you go live

const client = StandardCheckoutClient.getInstance(
  clientId,
  clientSecret,
  clientVersion,
  env
);

const merchantOrderId = randomUUID();
const amount = 100;
const redirectUrl = "https://homentor.onrender.com";


// Async helper function to create the order
async function createPhonePeOrder() {
    let url = ''
  const merchantOrderId = randomUUID(); // Unique order ID
  const amount = 5000000; // Amount in paise (₹100)
  const redirectUrl = "https://homentor.onrender.com/payment-success"; // Your post-payment page

  const request = StandardCheckoutPayRequest.builder()
    .merchantOrderId(merchantOrderId)
    .amount(amount)
    .redirectUrl(redirectUrl)
    .build();

  const response = await client.pay(request).then((response) => {
  const checkoutPageUrl = response.redirectUrl;
  url = checkoutPageUrl
  console.log(checkoutPageUrl);
   
});
    return url;
  // This is the checkout page URL
}

// Payment endpoint
router.post("/pay-now", async (req, res) => {
  try {
    
    const redirectUrl = await createPhonePeOrder();

    console.log("Redirecting to:", redirectUrl);
    res.json(redirectUrl); // ✅ Server-side redirect
  } catch (err) {
    console.error("PhonePe Payment Error:", err);
    res.status(500).send("Payment Failed");
  }
});
module.exports = router;
