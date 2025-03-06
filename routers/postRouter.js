const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const postController = require("../controllers/postController"); // 게시글 컨트롤러
const upload = require("../config/multer");

// 회원가입 라우트
router.post("/signup", upload.single("profilePic"), userController.signup);

// 회원가입 페이지 (GET)
router.get("/sign", (req, res) => {
  res.render("sign");
});

// 로그인 라우트
router.post("/login", userController.login);

// 게시글 수정 페이지 (GET)
router.get("/edit-post/:id", postController.editPostPage); // 게시글 수정 페이지

// 게시글 수정 처리 (POST)
router.post("/update-post", upload.single("image"), postController.updatePost); // 수정된 정보 저장

module.exports = router;
