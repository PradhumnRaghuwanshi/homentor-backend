const axios = require("axios");
const generateToken = require("./generateToken");

const sendOtp = async (mobileNumber) => {
  const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDLTMzNDkwN0Q2RUEzNzQ4RCIsImlhdCI6MTc1NTQzMjUxMSwiZXhwIjoxOTEzMTEyNTExfQ.1ey_DQZHtosXDMzTd2yt_gOoBkaSE8lMV4-gb3ZnGa4V-_qSpoZsa6HmGODwU_2fzCNcuX9ziBOyEEYU_bXsEg";
  // const token = await generateToken();

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
