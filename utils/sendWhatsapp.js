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

  if (!ACCOUNT_SID || !API_KEY || !API_TOKEN) {
    throw new Error("Exotel credentials missing");
  }

  const url = `https://api.exotel.com/v2/accounts/${ACCOUNT_SID}/messages`;

  const payload = {
    custom_data: customData,
    whatsapp: {
      messages: [
        {
          from: "+15557943146", // ✅ NO PLUS SIGN
          to: "919630709988",              // ✅ dynamic number
          content: {
            type: "template",
            template: {
              name: "booking", // ✅ dynamic template
              language: {
                policy: "deterministic",
                code: "en",
              },
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
    },
  };

  try {
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
    console.error("❌ Exotel Error:");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }

    throw error;
  }
}

module.exports = sendWhatsappTemplate;
