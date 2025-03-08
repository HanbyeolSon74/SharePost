// routers/postRouter.js
const express = require("express");
const router = express.Router();
const { uploadBoardImage } = require("../config/multer"); // upload 미들웨어 import
const { createPost } = require("../controllers/postController"); // 게시글 생성 컨트롤러

// 게시글 생성 (게시글 이미지 업로드 포함)
router.post("/post", uploadBoardImage.single("mainBoardImage"), createPost);

// 게시글 수정 페이지 (GET)
// router.get("/edit/:id", postController.editPostPage);

// 게시글 수정 처리 (POST)
// router.post(
//   "/edit",
//   upload.single("mainBoardImage"), // 이미지 파일 업로드 처리
//   postController.updatePost // 게시글 수정 컨트롤러 호출
// );

module.exports = router;
