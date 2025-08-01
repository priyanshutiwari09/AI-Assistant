import bg from "../assets/authBg.png";
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { userDataContext } from "../context/UserContext";
import { toast } from "react-toastify";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { serverUrl, setUserData } = useContext(userDataContext);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    const { confirmPassword, ...safeData } = data;

    try {
      const res = await axios.post(`${serverUrl}/api/user/signup`, safeData, {
        withCredentials: true
      });

      if (res.status === 201) {
        toast.success("Signup successful!");
        setUserData(res.data);
        setTimeout(() => navigate("/customize"), 1000); // changed to /customize
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(msg);
      setUserData(null);
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
        className="w-[90%] max-w-[500px] py-10 px-5 bg-[#00000069] backdrop-blur-md shadow-lg shadow-black flex flex-col items-center gap-5"
        autoComplete="off"
      >
        <h1 className="text-white text-2xl md:text-3xl font-semibold mb-4 text-center">
          Register to <span className="text-blue-400">Virtual Assistant</span>
        </h1>

        {/* Name Input */}
        <input
          type="text"
          placeholder="Enter your name"
          {...register("name", { required: "Name is required" })}
          className="w-full h-[60px] border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 rounded-full text-lg outline-none"
        />
        {errors.name && (
          <p className="text-red-400 text-sm -mt-4">{errors.name.message}</p>
        )}

        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          autoComplete="off"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Invalid email address"
            }
          })}
          className="w-full h-[60px] border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 rounded-full text-lg outline-none"
        />
        {errors.email && (
          <p className="text-red-400 text-sm -mt-4">{errors.email.message}</p>
        )}

        {/* Password Input */}
        <div className="relative w-full h-[60px]">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            autoComplete="new-password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 5,
                message: "Password must be at least 5 characters"
              }
            })}
            className="w-full h-full border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 rounded-full text-lg outline-none pr-[50px]"
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-[16px] right-5 text-white cursor-pointer"
            role="button"
            tabIndex={0}
            aria-label="Toggle password visibility"
          >
            {showPassword ? <IoMdEyeOff size={24} /> : <IoEye size={24} />}
          </span>
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
          className="w-full h-[60px] border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 rounded-full text-lg outline-none"
        />
        {errors.confirmPassword && (
          <p className="text-red-400 text-sm -mt-4">
            {errors.confirmPassword.message}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-[150px] mt-4 bg-white text-black text-lg font-semibold rounded-full h-[60px] hover:bg-gray-200 transition"
        >
          Sign Up
        </button>

        <Link to="/signin" className="text-white text-sm mt-3">
          Already have an account?{" "}
          <span className="text-blue-400">Sign In</span>
        </Link>
      </form>
    </div>
  );
};

export default SignUp;
