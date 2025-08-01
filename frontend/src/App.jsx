import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Customize from "./pages/Customize";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext } from "react";
import { userDataContext } from "./context/UserContext";
import Customize2 from "./pages/Customize2";

function App() {
  const { userData, loading } = useContext(userDataContext);

  // ⏳ Wait for userData to be loaded before rendering routes
  if (loading) return <div>Loading...</div>;

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <Routes>
        <Route
          path="/"
          element={
            userData?.assistantImage && userData?.assistantName ? (
              <Home />
            ) : (
              <Navigate to="/customize" />
            )
          }
        />
        <Route
          path="/signup"
          element={!userData ? <SignUp /> : <Navigate to="/" />}
        />
        <Route
          path="/signin"
          element={!userData ? <SignIn /> : <Navigate to="/" />}
        />
        <Route
          path="/customize"
          element={userData ? <Customize /> : <Navigate to="/signin" />}
        />
        <Route
          path="/customize2"
          element={userData ? <Customize2 /> : <Navigate to="/signin" />}
        />
      </Routes>
    </>
  );
}

export default App;
