const express = require("express");

const router = express.Router();

const { signup, login, getCurrentUser } = require("../controllers/user.controller.js");
const { isAuth } = require("../middlewares/isAuth.js");

router.post("/signup", signup);
router.post("/login", login);
router.get("/current", isAuth ,getCurrentUser);

module.exports = router;
