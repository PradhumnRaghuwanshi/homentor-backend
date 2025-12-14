const axios = require("axios");

const sendOtp = async (mobileNumber) => {
  const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDLUU0NjQyMThGMjYwMTQ2QSIsImlhdCI6MTc2MjYyNTM3MywiZXhwIjoxOTIwMzA1MzczfQ.6XQqj-ji5vkHQAADUx0b9LrIsuGLkpOS3Lkjr7kox-406p2YU9JXtwYuA7AJY7WmQjB5kHPh7vhpT4Nro9bUHw";

  const url = "https://cpaas.messagecentral.com/verification/v3/send";
  const params = {
    countryCode: "91",
    mobileNumber: mobileNumber,
    flowType: "SMS",
    otpLength: 6,
  };

  try {
    const response = await axios.post(url, null, {
      params,
      headers: {
        authToken: token,
      },
    });
    console.log(response.data)
    return response.data;
  } catch (err) {
    console.error("Failed to send OTP:", err.response?.data || err.message);
    throw new Error("OTP sending failed");
  }
};



module.exports = sendOtp;
