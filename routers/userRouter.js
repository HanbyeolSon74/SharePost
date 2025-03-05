const express = require("express");
const upload = require("../config/multer"); // multer 미들웨어
const userController = require("../controllers/userController"); // 컨트롤러 임포트
const router = express.Router();

// 회원가입 라우트
router.post("/signup", upload.single("profilePic"), userController.signup); // signup 메서드 호출

module.exports = router;
