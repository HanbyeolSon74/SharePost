const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const upload = require("../config/multer"); // 이미지 업로드 설정

// 게시판 관련 라우트
router.get("/board", postController.board);
router.get("/editboard", postController.editBoard);
router.get("/editpost", postController.editPost);
router.get("/main", postController.main);

// 게시글 수정 페이지 (GET)
router.get("/edit-post/:id", postController.editPostPage);

// 게시글 수정 처리 (POST)
router.post("/update-post", upload.single("image"), postController.updatePost);

module.exports = router;
