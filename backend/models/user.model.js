const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minLength: 5
    },
    assistantName: {
      type: String
    },
    assistantImage: {
      type: String
    },
    history: [
      {
        role: { type: String, enum: ["user", "assistant"], required: true },
        text: { type: String, required: true }
      }
    ]
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
