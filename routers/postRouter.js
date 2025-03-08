const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth"); // 인증 미들웨어
const { uploadBoardImage } = require("../config/multer"); // upload 미들웨어 import
const { createPost, getPosts } = require("../controllers/postController"); // 게시글 생성 컨트롤러
const { refreshAccessToken } = require("../controllers/authController");

const BOARD_IMAGE_FIELD = "mainBoardImage"; // 상수화

// 리프레시 토큰을 사용하여 새로운 액세스 토큰 발급
router.post("/refresh-token", refreshAccessToken);

// 로그인 후 보호된 라우터 예시 (액세스 토큰 검증)
router.post("/protected-route", verifyToken, (req, res) => {
  res.json({ message: "로그인된 사용자만 접근 가능합니다." });
});

// 게시글 생성 (게시글 이미지 업로드 포함)
router.post(
  "/post",
  verifyToken,
  uploadBoardImage.single(BOARD_IMAGE_FIELD), // 상수 사용
  createPost
);

// 게시글 목록 조회
router.get("/main", getPosts);

// 게시글 수정 페이지 (GET) (추후 추가할 수 있음)
// router.get("/edit/:id", postController.editPostPage);

// 게시글 수정 처리 (POST) (추후 추가할 수 있음)
// router.post(
//   "/edit",
//   upload.single(BOARD_IMAGE_FIELD), // 상수화된 필드명 사용
//   postController.updatePost // 게시글 수정 컨트롤러 호출
// );

module.exports = router;
