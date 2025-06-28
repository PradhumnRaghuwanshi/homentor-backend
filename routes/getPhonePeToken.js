const axios = require("axios");
const qs = require("qs");

let cachedToken = null;
let tokenExpiry = 0; // Epoch time

const getPhonePeToken = async () => {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && now < tokenExpiry) {
    return cachedToken;
  }
  const data = qs.stringify({
    client_id: "TEST-M220MIDZKK8US_25060",
    client_version: "1",
    client_secret: "YWJkZjUyOGYtYjU4ZC00ZjAxLThmOTMtNjM3MmFmYmFiYTY0",
    grant_type: "client_credentials"
  });
  try {
    const response = await axios.post(
      "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token",
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
    console.log(response.data)
    const { access_token, expires_at } = response.data;
    cachedToken = access_token;
    tokenExpiry = expires_at - 60; // buffer before expiry

    return access_token;
  } catch (error) {
    console.error("Token fetch failed:", error.response?.data || error.message);
    throw error;
  }
};

module.exports = getPhonePeToken;
