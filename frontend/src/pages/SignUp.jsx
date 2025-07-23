import bg from "../assets/authBg.png";
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("/api/auth/signup", data, {
        withCredentials: true
      });

      if (res.status === 201) {
        navigate("/signin");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const password = watch("password");

  return (
    <div
      className="w-full h-[100vh] bg-cover bg-center flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[90%] h-auto py-[40px] max-w-[500px] bg-[#00000069] backdrop-blur-md shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px] px-[20px]"
      >
        <h1 className="text-white text-[30px] font-semibold mb-[20px]">
          Register to <span className="text-blue-400">Virtual Assistant</span>
        </h1>

        <input
          type="text"
          placeholder="Enter your name"
          {...register("name", { required: "Name is required" })}
          className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
        />
        {errors.name && (
          <p className="text-red-400 text-sm -mt-4">{errors.name.message}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Invalid email address"
            }
          })}
          className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
        />
        {errors.email && (
          <p className="text-red-400 text-sm -mt-4">{errors.email.message}</p>
        )}

        {/* Password Field */}
        <div className="w-full relative h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[18px]">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 5,
                message: "Password must be at least 6 characters"
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

        {/* Confirm Password */}
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Confirm Password"
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) => value === password || "Passwords do not match"
          })}
          className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
        />
        {errors.confirmPassword && (
          <p className="text-red-400 text-sm -mt-4">
            {errors.confirmPassword.message}
          </p>
        )}

        <button
          type="submit"
          className="min-w-[150px] mt-[20px] font-semibold h-[60px] cursor-pointer bg-white rounded-full text-black text-[19px]"
        >
          Sign Up
        </button>

        <Link to="/signin" className="text-white text-[18px] mt-[10px]">
          Already have an account?{" "}
          <span className="text-blue-400">Sign In</span>
        </Link>
      </form>
    </div>
  );
};

export default SignUp;
