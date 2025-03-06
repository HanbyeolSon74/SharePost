const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const upload = require("../config/multer");

// 회원가입 라우트
router.post("/signup", upload.single("profilePic"), userController.signup);

// 회원가입 페이지 (GET)
router.get("/sign", (req, res) => {
  res.render("sign");
});

// 이메일 중복 확인 라우트
router.get("/checkEmail", userController.checkEmail);

// 로그인 라우트
router.post("/login", userController.login);

// 아이디 찾기 페이지
router.get("/findid", userController.findIdPage);

// 아이디 찾기 기능 처리
router.post("/findid", userController.findId);

// 비밀번호 수정 라우트
router.post("/reset-password", userController.resetPassword);

// 비밀번호 찾기 페이지
router.get("/findpassword", userController.findPasswordPage);

module.exports = router; // 라우터만 내보냄
