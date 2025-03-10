const express = require("express");
const router = express.Router();
const { naverCallback } = require("../controllers/authController");
const authController = require("../controllers/authController");
const naverController = require("../controllers/naverController"); // 네이버 로그인 관련 컨트롤러
const {
  redirectToNaver,
  handleNaverCallback,
} = require("../controllers/naverController"); // Correct path
const kakaoController = require("../controllers/kakaoController"); // 카카오 로그인 관련 컨트롤러
const auth = require("../middlewares/auth"); // 인증 미들웨어

// 로그인 관련 라우트
router.get("/login", (req, res) => res.render("login")); // 로그인 페이지
router.post("/login", authController.login); // 로그인 처리

// 로그아웃
router.post("/logout", authController.logout);

// 네이버 로그인 라우트
router.get("/login/naver", naverController.redirectToNaver); // 네이버 로그인 페이지로 리디렉션
router.get("/login/naver/callback", naverController.handleNaverCallback); // 네이버 로그인 콜백 (GET 요청)

// 카카오 로그인 라우트
router.get("/kakao/callback", kakaoController.kakaoLogin); // 카카오 로그인 콜백

module.exports = router;
