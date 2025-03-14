const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");
const { uploadProfilePic } = require("../config/multer");
const {
  getProfile,
  updateProfile,
  deleteProfile,
  getUserPosts,
  renderPosts,
  changePassword,
} = require("../controllers/profileController");
const {
  getLikedPosts,
  renderLikedPosts,
  toggleLike,
  getPostDetail,
  getLikeStatus,
} = require("../controllers/favoriteController");

// 내 정보 수정 페이지 라우터
router.get("/update", verifyToken, getProfile);

// 로그인 상태 확인 라우트
router.get("/check-login", (req, res) => {
  if (req.user) {
    return res.json({
      success: true,
      message: "로그인 상태입니다.",
      user: req.user,
    });
  } else {
    return res.json({ success: false, message: "로그인 상태가 아닙니다." });
  }
});

// 회원 정보 수정
router.post(
  "/update",
  verifyToken,
  uploadProfilePic.single("profilePic"), // 프로필 이미지 업로드 처리
  updateProfile
);

// 회원 탈퇴
router.post("/profile/delete", verifyToken, deleteProfile);

// 내 게시물 보기 (JSON 응답)
router.get("/myposts-json", verifyToken, getUserPosts);

// ✅ 내가 좋아요한 게시물 조회 (JSON 응답)
router.get("/favorites/posts/json", verifyToken, getLikedPosts);

// ✅ 내가 좋아요한 게시물 페이지 렌더링 (EJS 사용)
router.get("/favorites/posts", verifyToken, renderLikedPosts);

// ✅ 좋아요 상태 확인 (특정 게시물에 대해 사용자가 좋아요를 눌렀는지 확인)
router.get("/favorites/status/:postId", verifyToken, getLikeStatus);

// ✅ 좋아요 추가/취소 기능 활성화
router.post("/favorites/toggle/:postId", verifyToken, toggleLike);

// ✅ 상세 게시물 조회 (좋아요 수 포함)
router.get("/posts/:postId", verifyToken, getPostDetail);

// 비밀번호 변경
router.post("/changePassword", changePassword);

// 내 게시물 렌더링
router.get("/myposts", verifyToken, (req, res) => {
  res.render("myposts", {
    naverClientId: process.env.NAVER_CLIENT_ID,
    naverCallbackUrl: process.env.NAVER_CALLBACK_URL,
  });
});

router.post("/myposts/render", renderPosts);

module.exports = router;
