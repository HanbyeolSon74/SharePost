const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const upload = require("../config/multer"); // multer 설정을 불러옴

// // 게시글 작성 라우터 (POST)
// router.post(
//   "/post",
//   upload.single("mainBoardImage"),
//   postController.createPost
// );

// // 게시글 수정 페이지 (GET)
// router.get("/edit/:id", postController.editPostPage);

// // 게시글 수정 처리 (POST)
// router.post(
//   "/edit",
//   upload.single("mainBoardImage"),
//   postController.updatePost
// );

// // 모든 게시글 조회 라우터 (GET)
// router.get("/posts", postController.getPosts);

// 게시글 작성 라우터 (POST)
router.post("/post", postController.createPost);

// 게시글 수정 페이지 (GET)
router.get("/edit/:id", postController.editPostPage);

// 게시글 수정 처리 (POST)
router.post("/edit", postController.updatePost);

// 모든 게시글 조회 라우터 (GET)
// router.get("/posts", postController.getPosts);

module.exports = router;
