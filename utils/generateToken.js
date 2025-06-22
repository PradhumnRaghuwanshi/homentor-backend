const axios = require("axios");

const generateToken = async () => {
  const url = "https://cpaas.messagecentral.com/auth/v1/authentication/token";

  const customerId = "C-3F2E599D093D4C4";
  const email = "raghuwanshipradhumn@gmail.com";
  const country = "91";
  const key = Buffer.from("Pradhumn@22").toString("base64");

  const params = {
    customerId,
    key,
    email,
    scope: "NEW",
    country
  };

  try {
    console.log(params)
    const response = await axios.post(url, params, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data.token;
  } catch (err) {
    console.error("Token generation failed:", err.response?.data || err.message);
    throw new Error("Unable to generate token");
  }
};

module.exports = generateToken;
