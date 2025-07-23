const express = require("express");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const userRoutes = require("./routes/user.route.js");
const cookieParser = require("cookie-parser");

const app = express();
dotenv.config();

//Connect to MongoDB
const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${connect.connection.host}`);
  } catch (err) {
    console.log("MongoDB Connection Error: ", err);
  }
};

connectDB();

//MiddleWare
app.use(express.json());
app.use(cookieParser());

//API Routes
app.use("/api/user", userRoutes);

//Start Server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
