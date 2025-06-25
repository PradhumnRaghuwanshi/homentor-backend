const {
  StandardCheckoutClient,
  Env,
  StandardCheckoutPayRequest,
} = require("pg-sdk-node");
const { randomUUID } = require("crypto");
const express = require("express");
const router = express.Router();
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

// Async helper function to create the order
async function createPhonePeOrder(amount) {
  let url = "";
  const merchantOrderId = randomUUID(); // Unique order ID

  const redirectUrl = `https://homentor.onrender.com/payment-successful?orderId=${merchantOrderId}`; // Your post-payment page

  const request = StandardCheckoutPayRequest.builder()
    .merchantOrderId(merchantOrderId)
    .amount(amount * 100)
    .redirectUrl(redirectUrl)
    .build();

  const response = await client.pay(request);

  return { url: response.redirectUrl, merchantOrderId };
}

// Payment endpoint
router.post("/pay-now", async (req, res) => {
  try {
    const amount = await req.body.amount;
    const redirectUrl = await createPhonePeOrder(amount);

    console.log("Redirecting to:", redirectUrl);
    res.json(redirectUrl); // ✅ Server-side redirect
  } catch (err) {
    console.error("PhonePe Payment Error:", err);
    res.status(500).send("Payment Failed");
  }
});

// 🚀 Route 2: Handle Result Callback from Frontend
router.post("/payment-callback", async (req, res) => {
  const { status, phone, orderId } = req.body;

  if (status === "SUCCESS") {
    const message = `Dear parents, your payment (Order: ${orderId}) was successful. Welcome to HomeMentor!`;
    const token =
      "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDLTNGMkU1OTlEMDkzRDRDNCIsImlhdCI6MTc1MDU5MjAyMywiZXhwIjoxOTA4MjcyMDIzfQ.CU0VtNuJu5MzHoSh-ItvVdeYEQqURgRTHymtUtuka-S6fxqzfuLPM8KgoVIMiCc965oZjw-XoKvSPQZhk00S4g";
    const url = "https://cpaas.messagecentral.com/verification/v3/send";
    const params = {
      countryCode: "91",
      customerId: "C-3F2E599D093D4C4",
      senderId:"UTOMOB",
      type: "SMS",
      mobileNumber: phone,
      flowType: "SMS",
      message: message
    };

    try {
      const response = await axios.post(url, null, {
        params,
        headers: {
          authToken: token,
        },
      });
      console.log("✅ SMS sent to:", phone);
      res.json({ message: "Payment successful and SMS sent." });
    } catch (err) {
      console.error("❌ SMS failed:", err);
      res.status(500).json({ message: "Payment successful but SMS failed." });
    }
  } else {
    console.warn("❌ Payment failed or cancelled:", orderId);
    res.json({ message: "Payment failed or cancelled." });
  }
});

module.exports = router;
