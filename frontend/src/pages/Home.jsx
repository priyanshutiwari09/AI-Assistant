import { useContext, useState, useEffect, useRef } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);
  const navigate = useNavigate();

  const [isStarted, setIsStarted] = useState(false);
  const [showMicPrompt, setShowMicPrompt] = useState(false);
  const voicesRef = useRef([]);
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const checkIntervalRef = useRef(null);

  // Load voices once
  useEffect(() => {
    speechSynthesis.onvoiceschanged = () => {
      voicesRef.current = speechSynthesis.getVoices();
    };
    voicesRef.current = speechSynthesis.getVoices();
  }, []);

  const speak = (text, callback) => {
    if (!text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice =
      voicesRef.current.find((v) => v.lang === "en-US") || voicesRef.current[0];
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onend = callback;
    window.speechSynthesis.speak(utterance);
  };

  const showMicRestartPrompt = () => {
    speak("Hey, are you there? Tap the button to continue.");
    setShowMicPrompt(true);
  };

  const createRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      isListeningRef.current = true;
      setShowMicPrompt(false);
      console.log("Mic started listening...");
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("User said:", transcript);

      if (
        transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
      ) {
        recognition.stop();
        isListeningRef.current = false;
        const data = await getGeminiResponse(transcript);
        console.log("AI response:", data);
        handleCommand(data);
      }
    };

    recognition.onend = () => {
      console.log("Mic stopped — showing prompt");
      isListeningRef.current = false;
      showMicRestartPrompt(); // no if(isStarted) check
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      isListeningRef.current = false;
      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        // Permission denied
        showMicRestartPrompt();
      } else if (isStarted) {
        // Other mic issues
        showMicRestartPrompt();
      }
    };

    return recognition;
  };

  const startRecognition = () => {
    if (!recognitionRef.current) {
      recognitionRef.current = createRecognition();
    }
    try {
      recognitionRef.current.start();
    } catch (e) {
      console.warn("Recognition start failed:", e);
      showMicRestartPrompt();
    }

    // Safety check every 3s
    if (!checkIntervalRef.current) {
      checkIntervalRef.current = setInterval(() => {
        if (isStarted && !isListeningRef.current) {
          console.log("Safety restart mic...");
          try {
            recognitionRef.current.start();
          } catch {
            showMicRestartPrompt();
          }
        }
      }, 3000);
    }
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;

    speak(response, () => {
      startRecognition();
    });

    if (type === "google_search") {
      window.open(
        `https://www.google.com/search?q=${encodeURIComponent(userInput)}`,
        "_blank"
      );
    } else if (type === "calculator_open") {
      window.open(`https://www.google.com/search?q=calculator`, "_blank");
    } else if (type === "instagram_open") {
      window.open(`https://www.instagram.com/`, "_blank");
    } else if (type === "facebook_open") {
      window.open(`https://www.facebook.com/`, "_blank");
    } else if (type === "weather_show") {
      window.open(`https://www.google.com/search?q=weather`, "_blank");
    } else if (type === "youtube_search" || type === "youtube_play") {
      window.open(
        `https://www.youtube.com/results?search_query=${encodeURIComponent(
          userInput
        )}`,
        "_blank"
      );
    }
  };

  const handleStart = () => {
    speak("Voice enabled");
    console.log("TTS unlocked");
    setIsStarted(true);
    startRecognition();
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/user/logout`, {
        withCredentials: true
      });
    } catch (err) {
      console.log(err);
    }
    setUserData(null);
    setIsStarted(false);
    recognitionRef.current?.stop();
    clearInterval(checkIntervalRef.current);
    navigate("/sigin");
  };

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#02023d] flex justify-center items-center flex-col relative">
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

      {/* Floating mic restart prompt */}
      {showMicPrompt && (
        <div
          onClick={() => {
            startRecognition();
            setShowMicPrompt(false);
          }}
          className="fixed bottom-6 right-6 z-[9999] bg-yellow-500 text-black px-4 py-3 rounded-full shadow-lg cursor-pointer hover:bg-yellow-600 transition flex items-center gap-2"
        >
          🎤 Hey, are you there? Tap to continue
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
