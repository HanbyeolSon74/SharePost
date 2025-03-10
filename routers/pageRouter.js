const express = require("express");
const router = express.Router();
const { getUserById } = require("../controllers/userController");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares/auth");

// 각 페이지 렌더링 라우트
router.get("/board", (req, res) => res.render("board"));
router.get("/editboard", (req, res) => res.render("editboard"));
router.get("/editpost", (req, res) => res.render("editpost"));

// 🔹 프로필 수정 페이지 (로그인 상태 필수)
router.get("/editprofile", isLoggedIn, async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    res.render("editprofile", { user });
  } catch (error) {
    console.error("프로필 정보 불러오기 오류:", error);
    res.status(500).send("서버 오류");
  }
});

router.get("/editpw", (req, res) => res.render("editpw"));
router.get("/findid", (req, res) => res.render("findid"));
router.get("/sign", (req, res) => res.render("sign"));
router.get("/login", (req, res) => res.render("login"));
router.get("/main", (req, res) => res.render("main"));

module.exports = router;
