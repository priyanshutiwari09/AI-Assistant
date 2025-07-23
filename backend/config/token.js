// const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "7d"
//     });

const jwt = require("jsonwebtoken");

const genToken = async (userId) => {
  try {
    const token = await jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });
    return token;
  } catch (error) {
    console.log(error);
  }
};

module.exports = genToken;
