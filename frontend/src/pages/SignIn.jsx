import bg from "../assets/authBg.png";
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("/api/auth/signin", data, {
        withCredentials: true
      });

      if (res.status === 200) {
        navigate("/"); // or /dashboard
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="w-full h-[100vh] bg-cover bg-center flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[90%] max-w-[500px] bg-[#00000069] backdrop-blur-md shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px] px-[20px] py-[40px]"
      >
        <h1 className="text-white text-[30px] font-semibold mb-[20px]">
          Login to <span className="text-blue-400">Virtual Assistant</span>
        </h1>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Invalid email format"
            }
          })}
          className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
        />
        {errors.email && (
          <p className="text-red-400 text-sm -mt-4">{errors.email.message}</p>
        )}

        {/* Password */}
        <div className="w-full relative h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[18px]">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Minimum 6 characters required"
              }
            })}
            className="w-full outline-none h-full bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full"
          />
          {showPassword ? (
            <IoMdEyeOff
              className="absolute cursor-pointer top-[16px] h-[25px] w-[25px] right-[20px] text-white"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <IoEye
              className="absolute cursor-pointer top-[16px] h-[25px] w-[25px] right-[20px] text-white"
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>
        {errors.password && (
          <p className="text-red-400 text-sm -mt-4">
            {errors.password.message}
          </p>
        )}

        <button
          type="submit"
          className="min-w-[150px] mt-[20px] font-semibold h-[60px] cursor-pointer bg-white rounded-full text-black text-[19px]"
        >
          Sign In
        </button>

        <Link to="/signup" className="text-white text-[18px] mt-[10px]">
          Don’t have an account? <span className="text-blue-400">Sign Up</span>
        </Link>
      </form>
    </div>
  );
};

export default SignIn;
