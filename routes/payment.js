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
router.post("/create-order", async (req, res) => {
  try {
    const  amount  = 100;

    const merchantOrderId = randomUUID();
    const redirectUrl = "https://homentor.onrender.com/mentors"; // Update to your actual redirect URL

    const request = CreateSdkOrderRequest.StandardCheckoutBuilder()
      .merchantOrderId(merchantOrderId)
      .amount(amount)
      .redirectUrl(redirectUrl)
      .build();

    // const request = StandardCheckoutPayRequest.builder()
    //   .merchantOrderId(merchantOrderId)
    //   .amount(amount)
    //   .redirectUrl(redirectUrl)
    //   .build();

    const response = await client.createSdkOrder(request);
    const checkoutUrl = `https://webphonepe.com/v3/merchantpgpui/checkout?token=${response.token}`;
    // const response = await client.pay(request)
    // const checkoutPageUrl = response.redirectUrl;
    // console.log(checkoutPageUrl);
    console.log(response)
    res.json({
      success: true,
      token: response.token,
      merchantOrderId,
      redirectUrl: `https://webphonepe.com/v3/merchantpgpui/checkout?token=${response.token}`,
    });
  } catch (error) {
    console.error("PhonePe order creation failed:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create order", error });
  }
});

module.exports = router;
