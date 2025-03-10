const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");
const { uploadProfilePic } = require("../config/multer");
const {
  getProfilePage,
  updateProfile,
  deleteProfile,
  getUserPosts,
} = require("../controllers/profileController");

// 내 정보 수정 페이지 라우터
router.get("/editprofile", verifyToken, (req, res) => {
  // 로그인된 사용자의 정보를 바탕으로 내 정보 수정 페이지를 렌더링
  res.render("editprofile", { user: req.user });
});

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

// 내 정보 수정 페이지
router.get("/editprofile", verifyToken, getProfilePage);

// 회원 정보 수정
router.post(
  "/profile/update",
  verifyToken,
  uploadProfilePic.single("profileImage"), // 여기서 single을 호출합니다.
  updateProfile
);

// 회원 탈퇴
router.post("/profile/delete", verifyToken, deleteProfile);

// 내 게시물 보기
router.get("/my-posts", verifyToken, getUserPosts);

module.exports = router;
