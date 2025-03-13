const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { uploadProfilePic } = require("../config/multer");

// 📌 네이버 로그인 관련 처리
router.get("/naverAuth", userController.getNaverAuth); // getNaverAuth 메서드 호출

// 📌 회원가입 관련 라우트
router.get("/sign", (req, res) => res.render("sign")); // 회원가입 페이지
router.post(
  "/signup",
  uploadProfilePic.single("profilePic"),
  userController.signup
);

// 📌 이메일 중복 확인
router.get("/checkEmail", userController.checkEmail);

// 📌 아이디 찾기 라우트

router.post("/findid", userController.findId); // 아이디 찾기 처리

// userRouter.js

// 아이디 찾기 라우트
router.get("/findid", (req, res) => {
  res.render("findid"); // 아이디 찾기 페이지 렌더링
});
router.post("/findid", userController.findId); // 아이디 찾기 처리

// 📌 비밀번호 찾기 및 재설정 라우트
router.get("/reset-password", (req, res) =>
  // res.render("editpw", {
  //   naverClientId: process.env.NAVER_CLIENT_ID,
  //   naverCallbackUrl: process.env.NAVER_CALLBACK_URL,
  // })
  res.render("editpw")
); // 비밀번호 재설정 페이지
router.post("/find-password", userController.findPassword); // 비밀번호 찾기 처리
router.post("/reset-password", userController.resetPassword); // 비밀번호 변경 처리

module.exports = router;
