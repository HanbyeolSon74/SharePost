const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const upload = require("../config/multer");
const naverController = require("../controllers/naverController"); // 네이버 로그인 관련 컨트롤러 추가

// 회원가입 페이지 렌더링
router.get("/sign", (req, res) => {
  res.render("sign"); // sign.ejs 파일을 렌더링
});

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

// 네이버 로그인 라우트
router.get("/login/naver", naverController.redirectToNaver); // 네이버 로그인 페이지로 리디렉션

// 네이버 로그인 후 콜백 처리
router.get("/login/naver/callback", naverController.handleNaverCallback);

module.exports = router;
