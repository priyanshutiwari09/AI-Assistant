import { useContext, useState, useEffect } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);
  const navigate = useNavigate();

  const [isStarted, setIsStarted] = useState(false); // show/hide start UI
  let voices = [];

  speechSynthesis.onvoiceschanged = () => {
    voices = speechSynthesis.getVoices();
  };

  const speak = (text, callback) => {
    if (!text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voices.find((v) => v.lang === "en-US") || voices[0];
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onend = callback;
    window.speechSynthesis.speak(utterance);
  };

  const startRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("User said:", transcript);

      if (
        transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
      ) {
        recognition.stop();
        const data = await getGeminiResponse(transcript);
        console.log("AI response:", data);

        setTimeout(() => {
          speak(data.response, () => {
            recognition.start();
          });
        }, 150);
      }
    };

    recognition.start();
  };

  const handleStart = () => {
    // Unlock TTS
    const u = new SpeechSynthesisUtterance("Voice enabled");
    window.speechSynthesis.speak(u);
    console.log("TTS unlocked");

    // Start listening
    startRecognition();
    setIsStarted(true);
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/user/logout`, {
        withCredentials: true
      });
      setUserData(null);
      navigate("/sigin");
    } catch (err) {
      setUserData(null);
      console.log(err);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#02023d] flex justify-center items-center flex-col relative">
      {/* Overlay before starting */}
      {!isStarted && (
        <div className="absolute inset-0 bg-black/80 flex flex-col justify-center items-center z-50">
          <h2 className="text-white text-2xl font-semibold mb-6">
            Click to Start {userData?.assistantName}
          </h2>
          <button
            className="bg-white text-black px-6 py-3 rounded-full text-lg font-semibold hover:bg-gray-200 transition"
            onClick={handleStart}
          >
            Start Assistant
          </button>
        </div>
      )}

      <button
        className="min-w-[150px] absolute top-[20px] right-[20px] bg-white text-black text-lg font-semibold rounded-full h-[60px] hover:bg-gray-200 transition"
        onClick={handleLogout}
      >
        Logout
      </button>

      <button
        className="min-w-[150px] absolute py-[10px] px-[20px] top-[100px] right-[20px] mt-4 bg-white text-black text-lg font-semibold rounded-full h-[60px] hover:bg-gray-200 transition"
        onClick={() => navigate("/customize")}
      >
        Customize your Assistant
      </button>

      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden">
        <img
          src={userData?.assistantImage}
          alt=""
          className="h-full object-cover rounded-4xl shadow-lg"
        />
      </div>

      <h1 className="text-white text-[18px] font-semibold">
        I'm {userData?.assistantName}
      </h1>
    </div>
  );
};

export default Home;

// const handleCommand = (data) => {
//   const { type, userInput, response } = data;
//   speak(response);
//   console.log(response);

//   if (type === "google_search") {
//     const query = encodeURIComponent(userInput);
//     window.open(`https://www.google.com/search?q=${query}`, "_blank");
//   }

//   if (type === "calculator_open") {
//     window.open(`https://www.google.com/search?q=calculator`, "_blank");
//   }

//   if (type === "instagram_open") {
//     window.open(`https://www.instagram.com/`, "_blank");
//   }

//   if (type === "facebook_open") {
//     window.open(`https://www.facebook.com/`, "_blank");
//   }

//   if (type === "weather_show") {
//     window.open(`https://www.google.com/search?q=weather`, "_blank");
//   }

//   if (type === "youtube_search" || type === "youtube_play") {
//     const query = encodeURIComponent(userInput);
//     window.open(
//       `https://wwww.youtube.com/results?search_query=${query}, '_blank`
//     );
//   }
// };
