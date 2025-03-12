const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth"); // verifyToken 미들웨어 추가
const { uploadBoardImage } = require("../config/multer");
const {
  createPost,
  getPosts,
  getPost,
  editPostPage,
  updatePost,
  getMyPosts,
  likePost,
  getPostPage,
  deletePost,
} = require("../controllers/postController");

const favoriteController = require("../controllers/favoriteController");

const BOARD_IMAGE_FIELD = "mainBoardImage";
router.get("/post", (req, res) => {
  res.render("board", {
    naverClientId: process.env.NAVER_CLIENT_ID,
    naverCallbackUrl: process.env.NAVER_CALLBACK_URL,
  });
});

// 게시글 생성
router.post(
  "/post",
  verifyToken,
  uploadBoardImage.single(BOARD_IMAGE_FIELD),
  createPost
);

// 게시글 상세 조회
router.get("/post/:id", verifyToken, getPost);
router.get("/post/view/:id", getPostPage);

// 게시글 목록 조회
router.get("/main", getPosts);

// 내 게시글 보기
router.get("/myposts", verifyToken, getMyPosts);

// 게시글 수정 페이지
router.get("/post/edit/:id", verifyToken, editPostPage);
router.get("/favorites", favoriteController.getFavorites);

// 게시글 수정 처리
router.post(
  "/post/update/:id",
  verifyToken,
  uploadBoardImage.single(BOARD_IMAGE_FIELD),
  updatePost
);

// 좋아요 처리
router.post("/post/:id/like", likePost);

// 게시물 삭제 처리
router.post("/post/delete", verifyToken, deletePost);

module.exports = router;
