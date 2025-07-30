import { useState } from "react";
import { createContext } from "react";
import axios from "axios";
import { useEffect } from "react";

export const userDataContext = createContext();

const UserContext = ({ children }) => {
  const serverUrl = "http://localhost:5000";
  const [userData, setUserData] = useState(null);

  const handleCurrentUser = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true
      });

      setUserData(res.data);
      // console.log(userData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  // 👇 log userData when it actually changes
  useEffect(() => {
    console.log("Updated userData:", userData);
  }, [userData]);

  const value = {
    serverUrl
  };
  return (
    <div>
      <userDataContext.Provider value={value}>
        {children}
      </userDataContext.Provider>
    </div>
  );
};

export default UserContext;
