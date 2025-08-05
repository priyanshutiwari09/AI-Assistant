import { useContext } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const { userData, serverUrl, setUserData } = useContext(userDataContext);
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
