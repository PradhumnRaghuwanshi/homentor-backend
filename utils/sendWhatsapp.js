const axios = require("axios");

const sendWhatsappMessage = async ({
  to,
  templateName,
  bodyParams = [],
  language = "en",
}) => {
  try {
    const ACCOUNT_SID = process.env.EXOTEL_ACCOUNT_SID;
    const API_KEY = process.env.EXOTEL_API_KEY;
    const API_TOKEN = process.env.EXOTEL_API_TOKEN;

    // ✅ Mumbai cluster
    const BASE_URL = "https://api.exotel.com";

    const url = `${BASE_URL}/v2/accounts/${ACCOUNT_SID}/messagesCopy`;

    const payload = {
      messages: [
        {
          channel: "whatsapp",
          to: `whatsapp:${to}`, // +91XXXXXXXXXX
          content: {
            type: "template",
            template: {
              name: templateName,
              language: { code: language },
              components: [
                {
                  type: "body",
                  parameters: bodyParams.map((text) => ({
                    type: "text",
                    text: String(text),
                  })),
                },
              ],
            },
          },
        },
      ],
    };

    const response = await axios.post(url, payload, {
      auth: {
        username: API_KEY,
        password: API_TOKEN,
      },
      headers: {
        "Content-Type": "application/json",
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
