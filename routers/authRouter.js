const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController"); // 로그인, 로그아웃, 리프레시 토큰 관련 컨트롤러
const naverController = require("../controllers/naverController"); // 네이버 로그인 관련 컨트롤러
const kakaoController = require("../controllers/kakaoController"); // 카카오 로그인 관련 컨트롤러
const { verifyToken } = require("../middlewares/auth"); // verifyToken 미들웨어 추가

// 로그인 관련 라우트
router.get("/api/check-login", (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true });
  } else {
    res.json({ loggedIn: false });
  }
});

router.post("/login", authController.login); // 로그인 처리

// 로그아웃
router.post("/logout", authController.logout);

// 회원 탈퇴
router.post("/profile/delete", verifyToken, authController.deleteAccount); // 여기 수정

// 액세스 토큰 검증
router.get("/verify", authController.verifyAccessToken);

// 리프레시 토큰을 통한 액세스 토큰 갱신
router.post("/refresh-token", authController.refreshAccessToken);

// 네이버 로그인 라우트
router.get("/login/naver", naverController.redirectToNaver); // 네이버 로그인 페이지로 리디렉션
router.get("/login/naver/callback", naverController.handleNaverCallback); // 네이버 로그인 콜백 (GET 요청)
router.get("/getNaver", naverController.naverAPI);
// 카카오 로그인 라우트
router.get("/kakao/callback", kakaoController.kakaoCallback); // 카카오 로그인 콜백

// 보호된 라우터 예시 (JWT 토큰 검증 필요)
router.get("/some/protected/api", verifyToken, (req, res) => {
  res.json({ message: "보호된 리소스에 접근 성공" });
});

module.exports = router;
