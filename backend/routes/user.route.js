const express = require("express");

const router = express.Router();

const { signup, login, getCurrentUser, updateAssistant, askToAssistant, updateHistory, logout } = require("../controllers/user.controller.js");
const { isAuth } = require("../middlewares/isAuth.js");
const upload = require("../middlewares/multer.js");

router.post("/signup", signup);
router.post("/login", login);
router.post("/asktoassistant", isAuth, askToAssistant)
router.post("/update", isAuth , upload.single("assistantImage") ,updateAssistant);
router.post("/update-history", isAuth, updateHistory);
router.get("/current", isAuth ,getCurrentUser);
router.get("/logout", logout)

module.exports = router;