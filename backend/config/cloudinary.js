const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const uploadOnClodinary = async (filepath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
  });

  try {
    const uploadResult = await cloudinary.uploader.upload(filepath);

    fs.unlinkSync(filepath);
    return uploadResult.secure_url;
  } catch (err) {
    fs.unlinkSync(filepath);
    return res.status(500).json({ message: "Clodinary Error" });
  }
};

module.exports = uploadOnClodinary;
