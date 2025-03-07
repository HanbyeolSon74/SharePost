const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const upload = require("../config/multer");
const naverController = require("../controllers/naverController");

console.log("네이버 컨트롤러:", naverController);
console.log("redirectToNaver 함수:", naverController.redirectToNaver);
console.log("handleNaverCallback 함수:", naverController.handleNaverCallback);

// 회원가입 페이지 렌더링
router.get("/sign", (req, res) => {
  res.render("sign");
});

// 회원가입 라우트
router.post("/signup", upload.single("profilePic"), userController.signup);

// 로그인 라우트
router.post("/login", userController.login);

// 로그인 페이지 라우터
router.get("/login", (req, res) => {
  res.render("login"); // login.ejs 페이지를 렌더링
});

// 이메일 중복 확인
router.get("/checkEmail", userController.checkEmail);

// 아이디 찾기 페이지 (GET)
router.get("/findid", userController.findIdPage);

// 아이디 찾기 처리 (POST)
router.post("/findid", userController.findId);

// 비밀번호 재설정 페이지 렌더링 (GET)
router.get("/reset-password", (req, res) => {
  res.render("editpw");
});

// 비밀번호 찾기 요청
router.post("/find-password", userController.findPassword);

// 비밀번호 변경 요청
router.post("/reset-password", userController.resetPassword);

// 네이버 로그인 라우트
router.get("/login/naver", naverController.redirectToNaver); // 네이버 로그인 페이지로 리디렉션

// 네이버 로그인 후 콜백 처리
router.get("/login/naver/callback", naverController.handleNaverCallback); // GET 요청 지원
router.post("/login/naver/callback", naverController.handleNaverCallback); // POST 요청 지원

module.exports = router;
