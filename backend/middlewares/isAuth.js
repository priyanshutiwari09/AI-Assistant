const jwt = require("jsonwebtoken");

exports.isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(400).json({ message: "Token not Found" });
    }

    const verifyToken = await jwt.verify(token, process.env.JWT_SECRET);

    req.userId = verifyToken.userId;

    next();
  } catch (err) {
    return res
      .status(501)
      .json({ message: "isAuth Error", error: err.message });
  }
};
