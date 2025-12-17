const axios = require("axios");

const sendWhatsappMessage = async ({ to, message, customData }) => {
  try {
    const API_KEY = process.env.EXOTEL_API_KEY;
    const API_TOKEN = process.env.EXOTEL_API_TOKEN;
    const ACCOUNT_SID = process.env.EXOTEL_ACCOUNT_SID;
    const SUBDOMAIN = "@api.in.exotel.com"; // Mumbai cluster

    const url = `https://${API_KEY}:${API_TOKEN}${SUBDOMAIN}/v2/accounts/${ACCOUNT_SID}/messagesCopy`;

    const payload = {
      custom_data: customData || "",
      whatsapp: {
        to: to,                // Customer number (with country code)
        from: "+15557588278",  // Your Exotel WhatsApp number
        content: {
          type: "text",
          text: message
        }
      }
    };

    const response = await axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    return response.data;
  } catch (error) {
    console.error(
      "WhatsApp send error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

module.exports = sendWhatsappMessage;
