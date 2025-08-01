import Card from "../components/Card";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpeg";
import image8 from "../assets/authBg.png";
import { RiImageAddLine } from "react-icons/ri";
import { useState } from "react";
import { useRef } from "react";
import { useContext } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Customize = () => {
  const {
    serverUrl,
    userData,
    setUserData,
    loading,
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage
  } = useContext(userDataContext);
  const inputImage = useRef();
  const navigate = useNavigate();

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px] ">
      <h1 className="text-white text-[30px] mb-[40px] text-center">
        Select your <span className="text-blue-200">Assistant Image</span>
      </h1>
      <div className="w-full max-w-[900px] flex justify-center items-center gap-[15px] flex-wrap">
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <Card image={image7} />
        <Card image={image8} />

        <div
          className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#020220] border-2 border-[#0000ff60] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white flex justify-center items-center
            ${
              selectedImage == "input"
                ? "border-4 border-white shadow-2xl shadow-blue-950"
                : null
            }`}
          onClick={() => {
            inputImage.current.click();
            setSelectedImage("input");
          }}
        >
          {!frontendImage && (
            <RiImageAddLine className="text-white w-[25px] h-[25px] " />
          )}
          {frontendImage && (
            <img src={frontendImage} className="h-full object-cover" />
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={inputImage}
          hidden
          onChange={handleImage}
        />
      </div>
      {selectedImage && (
        <button
          className="min-w-[150px] mt-[20px] font-semibold h-[60px] cursor-pointer bg-white rounded-full text-black text-[19px]"
          onClick={() => navigate("/customize2")}
        >
          Next
        </button>
      )}
    </div>
  );
};

export default Customize;
