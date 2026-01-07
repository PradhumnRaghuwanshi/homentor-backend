const axios = require("axios");
const xml2js = require("xml2js");
const CallLog = require("../models/CallLog");
const Mentor = require("../models/Mentor");

function normalizePhone(phone) {
  if (!phone) return null;
  return phone
    .toString()
    .replace(/\D/g, "")     // remove non-digits
    .replace(/^0+/, "")     // remove leading zeros
    .slice(-10);            // keep last 10 digits
}
async function syncExotelCalls() {
  const {
    EXOTEL_API_KEY,
    EXOTEL_API_TOKEN,
    EXOTEL_ACCOUNT_SID
  } = process.env;

  const url = `https://api.exotel.com/v1/Accounts/${EXOTEL_ACCOUNT_SID}/Calls`;

  const response = await axios.get(url, {
    auth: {
      username: EXOTEL_API_KEY,
      password: EXOTEL_API_TOKEN
    },
    params: {
      PageSize: 50,
      SortBy: "DateCreated:desc"
    },
    responseType: "text"
  });

  const parser = new xml2js.Parser({ explicitArray: false });
  const result = await parser.parseStringPromise(response.data);

  let calls =
    result?.TwilioResponse?.Call
      ? Array.isArray(result.TwilioResponse.Call)
        ? result.TwilioResponse.Call
        : [result.TwilioResponse.Call]
      : [];

  for (const call of calls) {
    const mentorPhone = normalizePhone(call.To)
    const mentor = await Mentor.findOne({ phone: mentorPhone });

    await CallLog.updateOne(
      { callSid: call.Sid },
      {
        $setOnInsert: {
          callSid: call.Sid,
          parentPhone: call.From,
          mentorPhone: call.To,
          exophone: call.PhoneNumber,
         mentorName: mentor?.fullName || "Unknown Mentor",
          status: call.Status,
          duration: Number(call.Duration || 0),
          price: Number(call.Price || 0),

          startTime: new Date(call.StartTime),
          endTime: new Date(call.EndTime),

          recordingUrl: call.RecordingUrl || null,
          direction: call.Direction,
          answeredBy: call.AnsweredBy,

          rawExotelData: call
        }
      },
      { upsert: true }
    );
  }

  return calls.length;
}

module.exports = syncExotelCalls;
