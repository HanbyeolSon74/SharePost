// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const upload = require("../config/multer");

// 회원가입 라우트
router.post("/signup", upload.single("profilePic"), userController.signup);

// 이메일 중복 확인 라우트
router.get("/checkEmail", userController.checkEmail); // /user/checkEmail -> /checkEmail

module.exports = router;
