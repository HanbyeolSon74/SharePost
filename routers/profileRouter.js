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
const { getLikedPosts } = require("../controllers/favoriteController");

// 내 정보 수정 페이지 라우터
router.get("/editprofile", verifyToken, getProfile);

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
  uploadProfilePic.single("profileImage"), // 프로필 이미지 업로드 처리
  updateProfile
);

// 회원 탈퇴
router.post("/profile/delete", verifyToken, deleteProfile);

// 내 게시물 보기
router.get("/myposts-json", verifyToken, getUserPosts);

// 내가 좋아요한 게시물 조회 (JSON 형태로 반환)
router.get("/favorites/posts", verifyToken, getLikedPosts);

// 내가 좋아요한 게시물
router.get("/favorites/posts", (req, res) => {
  res.render("mylike", {
    headerData: {
      naverClientId: process.env.NAVER_CLIENT_ID, // 환경 변수에서 클라이언트 ID 불러오기
      naverCallbackUrl: process.env.NAVER_CALLBACK_URL, // 환경 변수에서 콜백 URL 불러오기
    },
  });
});

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
