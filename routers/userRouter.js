const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const upload = require("../config/multer");

// 회원가입 라우트
router.post("/signup", upload.single("profilePic"), userController.signup);

// 로그인 라우트
router.post("/login", userController.login);

// 이메일 중복 확인
router.get("/checkEmail", userController.checkEmail);

// 아이디 찾기 페이지 (GET)
router.get("/findid", userController.findIdPage);

// 아이디 찾기 처리 (POST)
router.post("/findid", userController.findId);

// 비밀번호 찾기 페이지
router.get("/findpassword", userController.findPasswordPage);

// 비밀번호 재설정 (POST)
router.post("/reset-password", userController.resetPassword);

module.exports = router;
