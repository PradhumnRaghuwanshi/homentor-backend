const express = require('express');
const router = express.Router();
const { createPhonePeOrder } = require('../utils/phonepe-utils');

router.get('/pay-now', async (req, res) => {
  try {
    const { redirectUrl } = await createPhonePeOrder();
    return res.redirect(redirectUrl); // ✅ Server-side redirect
  } catch (err) {
    console.error("Payment Error:", err.message);
    res.status(500).send("Payment Failed");
  }
});

module.exports = router;
