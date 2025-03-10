const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const naverController = require("../controllers/naverController");
const kakaoController = require("../controllers/kakaoController");
const auth = require("../middlewares/auth");

console.log("🔹 네이버 컨트롤러:", naverController);
console.log("🔹 redirectToNaver 함수:", naverController.redirectToNaver);
console.log(
  "🔹 handleNaverCallback 함수:",
  naverController.handleNaverCallback
);

// 📌 로그인 관련 라우트
router.get("/login", (req, res) => res.render("login")); // 로그인 페이지
router.post("/login", authController.login); // 로그인 처리

// 📌 로그아웃
router.post("/logout", authController.logout);

// 📌 토큰 갱신 (예: JWT)
// router.post("/refresh", authController.refreshToken);

// 📌 네이버 로그인 라우트
router.get("/login/naver", naverController.redirectToNaver); // 네이버 로그인 페이지로 리디렉션
router.get("/login/naver/callback", naverController.handleNaverCallback); // 네이버 로그인 콜백 (GET 요청)
router.post("/login/naver/callback", naverController.handleNaverCallback); // 네이버 로그인 콜백 (POST 요청)

// 📌 카카오 로그인 라우트
router.get("/kakao/callback", kakaoController.kakaoLogin); // 카카오 로그인 콜백

module.exports = router;
