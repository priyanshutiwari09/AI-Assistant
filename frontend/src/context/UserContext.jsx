import { createContext, useEffect, useState } from "react";
import axios from "axios";

// Create context
export const userDataContext = createContext();

const UserContext = ({ children }) => {
  const serverUrl = "http://localhost:5000";

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // added loading state
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleCurrentUser = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true
      });
      setUserData(res.data);
    } catch (err) {
      console.error("Failed to fetch current user:", err);
    } finally {
      setLoading(false); // ensure loading is turned off even on error
    }
  };

  const getGeminiResponse = async (command) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/asktoassistant`,
        { command },
        { withCredentials: true }
      );

      return result.data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  // Debug log when userData changes
  useEffect(() => {
    if (userData !== null) {
      console.log("Updated userData:", userData);
    }
  }, [userData]);

  // Context value
  const value = {
    serverUrl,
    userData,
    setUserData,
    loading,
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
    getGeminiResponse
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
};

export default UserContext;
