const {
  StandardCheckoutClient,
  Env,
  StandardCheckoutPayRequest,
} = require("pg-sdk-node");
const { randomUUID } = require("crypto");

const clientSecret = "YWJkZjUyOGYtYjU4ZC00ZjAxLThmOTMtNjM3MmFmYmFiYTY0";
const clientVersion = 1;
const clientId = "TEST-M220MIDZKK8US_25060";
const env = Env.SANDBOX; //change to Env.PRODUCTION when you go live

const client = StandardCheckoutClient.getInstance(
  clientId,
  clientSecret,
  clientVersion,
  env
);

const merchantOrderId = randomUUID();
const amount = 100;
const redirectUrl = "https://homentor.onrender.com";

const request = StandardCheckoutPayRequest.builder()
  .merchantOrderId(merchantOrderId)
  .amount(amount)
  .redirectUrl(redirectUrl)
  .build();

client.pay(request).then((response) => {
  const checkoutPageUrl = response.redirectUrl;
  console.log(checkoutPageUrl);
});

router.post("/pay-now", async (req, res) => {
  try {
    const { redirectUrl } = await createPhonePeOrder();
    console.log(redirectUrl);
    return res.redirect(redirectUrl); // ✅ Server-side redirect
  } catch (err) {
    console.error("Payment Error:", err.message);
    res.status(500).send("Payment Failed");
  }
});

module.exports = router;
