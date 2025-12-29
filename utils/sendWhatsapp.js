const axios = require("axios");

async function sendWhatsappTemplate({
  to,
  templateName,
  bodyParams = [],
  customData = "booking_notification",
}) {
  const ACCOUNT_SID = process.env.EXOTEL_ACCOUNT_SID;
  const API_KEY = process.env.EXOTEL_API_KEY;
  const API_TOKEN = process.env.EXOTEL_API_TOKEN;

  const url = `https://api.exotel.com/v2/accounts/${ACCOUNT_SID}/messages`;

  const payload = {
    custom_data: customData,
    whatsapp: {
      messages: [
        {
          from: "+15557867037", // Approved WhatsApp number
          to : "918878084604",
          content: {
            type: "template",
            template: {
              name: "booking",
              language: {
                policy: "deterministic",
                code: "en",
              },
              components: [
                {
                  type: "body",
                  parameters: bodyParams.map((text) => ({
                    type: "text",
                    text,
                  })),
                },
              ],
            },
          },
        },
      ],
    },
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
}

module.exports = sendWhatsappTemplate;

