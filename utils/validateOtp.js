const axios = require("axios");
const generateToken = require("./generateToken");
const User = require("../models/User");

const validateOtp = async (verificationId, code, phone) => {
  const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDLTNGMkU1OTlEMDkzRDRDNCIsImlhdCI6MTc1MDU5MjAyMywiZXhwIjoxOTA4MjcyMDIzfQ.CU0VtNuJu5MzHoSh-ItvVdeYEQqURgRTHymtUtuka-S6fxqzfuLPM8KgoVIMiCc965oZjw-XoKvSPQZhk00S4g";

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
