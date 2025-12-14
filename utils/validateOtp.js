const axios = require("axios");
const User = require("../models/User");

const validateOtp = async (verificationId, code, phone) => {
  const token =
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDLUU0NjQyMThGMjYwMTQ2QSIsImlhdCI6MTc2MjYyNTM3MywiZXhwIjoxOTIwMzA1MzczfQ.6XQqj-ji5vkHQAADUx0b9LrIsuGLkpOS3Lkjr7kox-406p2YU9JXtwYuA7AJY7WmQjB5kHPh7vhpT4Nro9bUHw";

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
