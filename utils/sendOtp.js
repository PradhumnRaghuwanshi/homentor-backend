const axios = require("axios");
const generateToken = require("./generateToken");

const sendOtp = async (mobileNumber) => {
  const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDLThDODE3M0UzMDM4QTQ4NCIsImlhdCI6MTc1NDAzMTk0MywiZXhwIjoxOTExNzExOTQzfQ.xZesgbwmv9g2uypje1YpPaJLA1ZyXHFO0eNv3gjpBo6hfY65D3uaMIlsuDhJRL1zsTaL4Z8O5ThNk0iPdbkpfw";
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
