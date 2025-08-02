const express = require("express");

const router = express.Router();

const { signup, login, getCurrentUser, updateAssistant } = require("../controllers/user.controller.js");
const { isAuth } = require("../middlewares/isAuth.js");
const upload = require("../middlewares/multer.js");

router.post("/signup", signup);
router.post("/login", login);
router.post("/update", isAuth , upload.single("assistantImage") ,updateAssistant);
router.get("/current", isAuth ,getCurrentUser);

module.exports = router;