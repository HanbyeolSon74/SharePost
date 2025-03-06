const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const upload = require("../config/multer");

// 회원가입 라우트
router.post("/signup", upload.single("profilePic"), userController.signup);

// 회원가입 페이지 (GET)
router.get("/sign", (req, res) => {
  res.render("sign"); // signup.ejs 페이지 렌더링
});
// 이메일 중복 확인 라우트
router.get("/checkEmail", userController.checkEmail);

// 로그인 라우트
router.post("/login", userController.login);

// 아이디 찾기 페이지
router.get("/findid", userController.findIdPage);

// 아이디 찾기 기능 처리
router.post("/findid", userController.findId);

module.exports = router;
