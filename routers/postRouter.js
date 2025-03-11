// routers/postRouter.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");
const { uploadBoardImage } = require("../config/multer");
const {
  createPost,
  getPosts,
  getPost,
  editPostPage,
  updatePost,
  likePost,
  getPostPage,
} = require("../controllers/postController");

const favoriteController = require("../controllers/favoriteController");

const BOARD_IMAGE_FIELD = "mainBoardImage";

// 게시글 생성
router.post(
  "/post",
  verifyToken,
  uploadBoardImage.single(BOARD_IMAGE_FIELD),
  createPost
);

// 게시글 상세 조회
router.get("/post/:id", getPost);
router.get("/post/view/:id", getPostPage);

// 게시글 목록 조회
router.get("/main", getPosts);

// 게시글 수정 페이지
router.get("/post/edit/:id", verifyToken, editPostPage);
router.get("/favorites", favoriteController.getFavorites);

// 게시글 수정 처리
router.post(
  "/edit",
  verifyToken,
  uploadBoardImage.single(BOARD_IMAGE_FIELD),
  updatePost
);

// 좋아요 처리
router.post("/post/:id/like", likePost);

module.exports = router;
