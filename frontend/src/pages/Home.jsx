import { useContext, useState, useEffect, useRef } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ai from "../assets/ai.gif";
import userImg from "../assets/user.gif";
import { Menu, X } from "lucide-react"; // 👈 icons

const Home = () => {
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);
  const navigate = useNavigate();

  const [isStarted, setIsStarted] = useState(false);
  const [showMicPrompt, setShowMicPrompt] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); // 👈 new state
  const [menuOpen, setMenuOpen] = useState(false); // 👈 menu state
  const voicesRef = useRef([]);
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const checkIntervalRef = useRef(null);
  const skipPromptRef = useRef(false);

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

    // 👇 Track speaking state
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      callback && callback();
    };

    window.speechSynthesis.speak(utterance);
  };

  const showMicRestartPrompt = () => {
    console.log("🎤 Hey, are you there? Tap to continue");
    setShowMicPrompt(true);
    speak("Hey, are you there? Tap the screen to continue.");
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
        skipPromptRef.current = true;
        recognition.stop();
        isListeningRef.current = false;

        const data = await getGeminiResponse(transcript);
        console.log("AI response:", data);
        handleCommand(data);
      }
    };

    recognition.onend = () => {
      console.log("🔴 recognition.onend fired");
      isListeningRef.current = false;

      if (skipPromptRef.current) {
        skipPromptRef.current = false;
        return;
      }

      console.log("💬 No speech detected — showing fallback prompt");
      showMicRestartPrompt();
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      isListeningRef.current = false;
      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        showMicRestartPrompt();
      } else if (isStarted) {
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
    skipPromptRef.current = true;

    speak(response, () => {
      console.log("✅ AI finished speaking, restarting mic");
      startRecognition();
      setTimeout(() => {
        skipPromptRef.current = false;
      }, 500);
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
      {/* Start screen */}
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

      {/* Mic prompt */}
      {showMicPrompt && (
        <div
          onClick={() => {
            startRecognition();
            setShowMicPrompt(false);
          }}
          className="fixed bottom-6 right-6 z-[9999] bg-yellow-500 text-black px-5 py-3 rounded-full shadow-xl cursor-pointer hover:bg-yellow-600 transition flex items-center gap-2 animate-bounce"
        >
          🎤 Hey, are you there? Tap to continue
        </div>
      )}

      {/* 👇 Hamburger button */}
      <button
        className="absolute top-6 right-6 z-50 bg-white text-black p-3 rounded-full shadow-md hover:bg-gray-200"
        onClick={() => setMenuOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* 👇 Sidebar menu */}
      {/* 👇 Sidebar menu */}
      {menuOpen && (
        <div className="fixed top-0 right-0 w-72 h-full bg-black/95 text-white shadow-lg z-[10000] flex flex-col p-6 transition">
          {/* Close */}
          <button className="self-end mb-6" onClick={() => setMenuOpen(false)}>
            <X size={28} />
          </button>

          {/* Buttons */}
          <button
            className="w-full bg-white text-black text-lg font-semibold rounded-full py-3 mb-4 hover:bg-gray-200 transition"
            onClick={handleLogout}
          >
            Log Out
          </button>

          <button
            className="w-full bg-white text-black text-lg font-semibold rounded-full py-3 mb-6 hover:bg-gray-200 transition"
            onClick={() => navigate("/customize")}
          >
            Customize your Assistant
          </button>

          {/* Divider */}
          <div className="border-t border-gray-700 my-4"></div>

          {/* History Section */}
          <h2 className="text-lg font-semibold mb-3">🕑 History</h2>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-600">
            {userData?.history && userData.history.length > 0 ? (
              userData.history.map((item, index) => (
                <div
                  key={index}
                  className="bg-white/10 hover:bg-white/20 p-3 rounded-lg cursor-pointer"
                  onClick={() => {
                    // Optional: allow re-running a past query
                    console.log("Selected history:", item);
                    // you could also call handleCommand(item) here
                  }}
                >
                  {item.userInput || "Untitled"}
                </div>
              ))
            ) : (
              <p className="text-gray-400">No history yet</p>
            )}
          </div>
        </div>
      )}

      {/* Assistant Avatar */}
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

      {/* AI/User gif */}
      {isStarted && (
        <img
          src={isSpeaking ? ai : userImg}
          alt="AI status"
          className="w-20 h-20 mt-4 rounded-full object-cover shadow-lg"
        />
      )}
    </div>
  );
};

export default Home;
