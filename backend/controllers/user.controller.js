const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const genToken = require("../config/token");
const uploadOnClodinary = require("../config/cloudinary.js");
const geminiResponse = require("../gemini.js");
const moment = require("moment");
const { response } = require("express");

// Sign up controller
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  console.log("Signup request body:", req.body);

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    // if (password !== confirmPassword) {
    //   return res
    //     .status(400)
    //     .json({ message: "Password & Confirm Password do not match" });
    // }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });
    await newUser.save();

    // If you don't want to auto-login on signup, skip setting the token
    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

// Login controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "strict",
      secure: false // Set to true in production (HTTPS)
    });

    return res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

// Logout controller
exports.logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: false, // must match what you used at login
      path: "/" // default path must be specified here too
    });

    return res.status(200).json({ message: "Logout Successful" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Logout Error", error: err.message });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500), json({ message: "Get current user error" });
  }
};

exports.updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
    let assistantImage;

    if (req.file) {
      assistantImage = await uploadOnClodinary(req.file.path);
    } else {
      assistantImage = imageUrl;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        assistantName,
        assistantImage
      },
      { new: true }
    ).select("-password");

    return res.status(200).json(user);
  } catch (err) {
    return res.status(400).json({ message: "update assistant error" });
  }
};

exports.askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;
    const user = await User.findById(req.userId);
    const userName = user.name;
    const assistantName = user.assistantName;

    const result = await geminiResponse(command, userName, assistantName);

    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(400).json({ message: "Sorry, i can't understand" });
    }
    const gemResult = JSON.parse(jsonMatch[0]);

    const type = gemResult.type;

    switch (type) {
      case "get_date":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current date is ${moment().format("YYYY-MM-DD")}`
        });

      case "get_time":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current time is ${moment().format("hh:mm:A")}`
        });

      case "get_day":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Today is ${moment().format("dddd")}`
        });

      case "get_month":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current month is ${moment().format("YMMMM")}`
        });

      case "google_search":
      case "youtube_search":
      case "youtube_play":
      case "general":
      case "calculator_open":
      case "instagram_open":
      case "facebook_open":
      case "weather_show":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response
        });

      default:
        return res
          .status(400)
          .json({ response: "I didn't understand that command" });
    }
  } catch (error) {
    return res.status(500).json({ response: "ask assistant error" });
  }
};

// Save user & assistant chat in history

// updateHistory.js (controller)
exports.updateHistory = async (req, res) => {
  try {
    const { userId, history } = req.body;

    if (!userId || !history || !Array.isArray(history)) {
      return res.status(400).json({
        success: false,
        message: "User ID and history array are required"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // ✅ Push each message into history
    history.forEach((msg) => {
      if (msg.role && msg.text) {
        user.history.push(msg);
      }
    });

    await user.save();

    res.json({
      success: true,
      message: "History updated",
      history: user.history
    });
  } catch (error) {
    console.error("Error updating history:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
