const https = require("follow-redirects").https;
const qs = require("querystring");

const sendWhatsappMessage = ({
  to,
  templateName,
  bodyParams = [],
  customData = "booking_notification",
}) => {
  return new Promise((resolve, reject) => {
    const ACCOUNT_SID = process.env.EXOTEL_ACCOUNT_SID;
    const API_KEY = process.env.EXOTEL_API_KEY;
    const API_TOKEN = process.env.EXOTEL_API_TOKEN;

    const options = {
      method: "POST",
      hostname: "api.exotel.com", // Singapore cluster
      path: `/v2/accounts/${ACCOUNT_SID}/messages`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " + Buffer.from(`${API_KEY}:${API_TOKEN}`).toString("base64"),
      },
      maxRedirects: 20,
    };

    const postData = qs.stringify({
      custom_data: customData,
      whatsapp: JSON.stringify({
        messages: [
          {
            from: "+15557588278",
            to: "+918878084604",
            content: {
              recepient_type: "individual",
              type: "text",
              text : {
                body: "Hello"
              }
            },
          },
        ],
      }),
    });

    const req = https.request(options, (res) => {
      let chunks = [];

      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        const body = Buffer.concat(chunks).toString();
        try {
          // Try parse JSON, fallback to raw text
          resolve(JSON.parse(body));
        } catch (err) {
          resolve({ raw: body });
        }
      });
      res.on("error", (err) => reject(err));
    });

    req.on("error", (err) => reject(err));
    req.write(postData);
    req.end();
  });
};

module.exports = sendWhatsappMessage;
