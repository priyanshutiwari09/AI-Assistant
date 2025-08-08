import { useContext } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

const Home = () => {
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/logout`, {
        withCredentials: true
      });

      setUserData(null);
      navigate("/sigin");
    } catch (err) {
      setUserData(null);
      console.log(err);
    }
  };

  const speak = (text) => {
    const utterence = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterence);
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    speak(response);

    if (type === "google_search") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
    }

    if (type === "calculator_open") {
      window.open(`https://www.google.com/search?q=calculator`, "_blank");
    }

    if (type === "instagram_open") {
      window.open(`https://www.instagram.com/`, "_blank");
    }

    if (type === "facebook_open") {
      window.open(`https://www.facebook.com/`, "_blank");
    }

    if (type === "weather_show") {
      window.open(`https://www.google.com/search?q=weather`, "_blank");
    }

    if (type === "youtube_search" || type === "youtube_play") {
      const query = encodeURIComponent(userInput);
      window.open(
        `https://wwww.youtube.com/results?search_query=${query}, '_blank`
      );
    }
  };
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.lang = "en-US";

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log(transcript);

      if (
        transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
      ) {
        const data = await getGeminiResponse(transcript);
        console.log(data);
        handleCommand(data);
      }
    };

    recognition.start();
  }, []);

  return (
    <div className="w-full gap-[15px] h-[100vh] bg-gradient-to-t from-[black] to-[#02023d] flex justify-center items-center flex-col relative">
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
      <div className="w-[300px] h-[400px] flex justify-center  items-center overflow-hidden">
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
