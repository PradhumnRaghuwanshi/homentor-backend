const axios = require("axios");
const qs = require("qs");

const sendWhatsappMessage = async ({
  to,
  templateName,
  bodyParams = [],
}) => {
  try {
    const ACCOUNT_SID = process.env.EXOTEL_ACCOUNT_SID;
    const API_KEY = process.env.EXOTEL_API_KEY;
    const API_TOKEN = process.env.EXOTEL_API_TOKEN;

    // ✅ Mumbai cluster (IMPORTANT)
    const BASE_URL = "https://api.exotel.com";

    const url = `${BASE_URL}/v2/accounts/${ACCOUNT_SID}/messages`;

    // ✅ Exotel expects FORM DATA (not JSON)
    const data = qs.stringify({
      From: "whatsapp:+15557588278	", // 👈 your Exotel approved WhatsApp number
      To: `whatsapp:${to}`,
      TemplateName: "booking",
      TemplateParams: JSON.stringify(bodyParams),
    });

    const response = await axios.post(url, data, {
      auth: {
        username: API_KEY,
        password: API_TOKEN,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "WhatsApp Template Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

module.exports = sendWhatsappMessage;
