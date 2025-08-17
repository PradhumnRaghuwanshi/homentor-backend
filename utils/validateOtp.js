const axios = require("axios");
const generateToken = require("./generateToken");
const User = require("../models/User");

const validateOtp = async (verificationId, code, phone) => {
  const token =
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDLTMzNDkwN0Q2RUEzNzQ4RCIsImlhdCI6MTc1NTQzMjUxMSwiZXhwIjoxOTEzMTEyNTExfQ.1ey_DQZHtosXDMzTd2yt_gOoBkaSE8lMV4-gb3ZnGa4V-_qSpoZsa6HmGODwU_2fzCNcuX9ziBOyEEYU_bXsEg";

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
