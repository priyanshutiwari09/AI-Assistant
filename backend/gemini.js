const axios = require("axios");

const geminiResponse = async (
  userInput,
  userName = "Priyanshu",
  assistantName = "Assistant"
) => {
  try {
    const prompt = `
You are a virtual assistant named ${assistantName}, created by ${userName}.
You are not Google. You will now behave like a voice-enabled assistant.

Your task is to understand the user's natural language input and respond with a JSON object like this:

{
  "type": "general" | "google_search" | "youtube_search" | "youtube_play" |
          "get_time" | "get_date" | "get_day" | "get_month" | "calculator_open" |
          "instagram_open" | "facebook_open" | "weather-show",
  "userInput": "<original user input>",
  "response": "<a short spoken response to read out loud to the user>"
}

Instructions:

- "type": determine the intent of the user.
- "userinput": original sentence the user spoke. Only remove your name (${assistantName}) if it appears.
- "response": a short voice-friendly reply, e.g., "Sure, playing it now", "Here's what I found", "Today is Tuesday", etc.

Type meanings:
- "general": if it's a factual or informational question.
- "google_search": if user wants to search something on Google.
- "youtube_search": if user wants to search something on YouTube.
- "youtube_play": if user wants to directly play a video or song.
- "calculator_open": if user wants to open a calculator.
- "instagram_open": if user wants to open Instagram.
- "facebook_open": if user wants to open Facebook.
- "weather-show": if user wants to know the weather.
- "get_time": if user asks for current time.
- "get_date": if user asks for today's date.
- "get_day": if user asks what day it is.
- "get_month": if user asks for the current month.

Important Rule:
- If user asks "tumhe kisne banaya", respond with author name as "${userName}".
- Only return the JSON object. No additional explanation.

Now your userInput: ${userInput}
`;

    const result = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        contents: [
          {
            parts: [{ text: prompt }]
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
    console.error("Gemini API Error:", error.response?.data || error.message);
    return null;
  }
};

module.exports = geminiResponse;
