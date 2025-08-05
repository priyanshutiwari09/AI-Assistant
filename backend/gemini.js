const axios = require("axios");
const geminiResponse = async (prompt) => {
  try {
    const result = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      },

      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        }
      }
    );

    return result.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.log(error);
  }
};

module.exports = geminiResponse;
