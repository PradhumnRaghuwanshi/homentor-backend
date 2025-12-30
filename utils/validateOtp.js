const axios = require("axios");
const User = require("../models/User");

const validateOtp = async (verificationId, code, phone) => {
  const token =
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDLTFCODU3MzFFQjE3MzRFNCIsImlhdCI6MTc2Njk5MTAyMCwiZXhwIjoxOTI0NjcxMDIwfQ.x6haO1N2GlLhX-5uEKyP8--QQawjAbwUH6SRKLyuJ18RqmLJG2gA7xuBq-umjSae3mwC0LmirMEiSMZ4s4sbZw";

  const url = "https://cpaas.messagecentral.com/verification/v3/validateOtp";
  const params = {
    verificationId,
    code,
    langId: "en",
  };

  try {
    const response = await axios.get(url, {
      params,
      headers: {
        authToken: token,
      },
    });
    // e.g., check if user exists → create if not
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ phone });
    }
    return response.data;
  } catch (err) {
    console.error("OTP validation failed:", err.response?.data || err.message);
    throw new Error("OTP validation failed");
  }
};

module.exports = validateOtp;
