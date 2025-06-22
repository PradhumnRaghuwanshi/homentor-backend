const axios = require("axios") ;
const crypto = require("crypto");
const User = require("../models/User");

const otpStore = {}; // In production, use Redis or DB

const sendOtp = async (req, res) => {
  const { phone } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  otpStore[phone] = { otp, expires: Date.now() + 5 * 60 * 1000 }; // 5 mins expiry

  try {
    const response = await axios.post(
      "https://cpaas.messagecentral.com/auth/v1/authentication/token",
      {
        sender: "C-3F2E599D093D4C4", // Replace with your sender ID
        mobile: `91${phone}`,           // Must include country code e.g. '919999999999'
        message: `your otp is ${otp}`,          // The message text
        template_id: "YOUR_DLT_TEMPLATE_ID", // Replace with actual DLT ID
      },
      {

      }
    
    )
    const url = `https://control.yourbulksms.com/api/sendhttp.php?authkey=3139656e746f7237303056&mobiles=${phone}&message=YourLogin%20Password%20is%20${otp}%20for%20Homentor.%20Do%20not%20share%20with%20anyone.%20EVOKE&sender=MTNMAR&route=2&country=91&DLT_TE_ID=1707172077746486856`;
              // `http://control.yourbulksms.com/api/sendhttp.php?authkey=3139656e746f7237303056&mobiles=${req.body.number}&message=YourLogin%20Password%20is%20${otp}%20for%20Homentor.%20Do%20not%20share%20with%20anyone.%20EVOKE&sender=MTNMAR&route=2&country=91&DLT_TE_ID=1707172077746486856`


    return res.json({ success: true, message: "OTP sent", response: response.data });
  } catch (err) {
    console.log(err)
    return res.status(500).json({ success: false, error: "Failed to send OTP" });
  }
};

const verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;
  const stored = otpStore[phone];

  if (!stored || stored.otp !== otp || stored.expires < Date.now()) {
    return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
  }

  delete otpStore[phone]; // Remove after use

  // Proceed to login/signup logic
  // e.g., check if user exists → create if not
  let user = await User.findOne({ phone });
  if (!user) {
    user = await User.create({ phone });
  }

  return res.json({ success: true, user });
};

module.exports = {sendOtp, verifyOtp}