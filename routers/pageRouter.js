const express = require("express");
const router = express.Router();

// 각 페이지 렌더링 라우트
router.get("/board", (req, res) => res.render("board"));
router.get("/editboard", (req, res) => res.render("editboard"));
router.get("/editpost", (req, res) => res.render("editpost"));
router.get("/editprofile", (req, res) => res.render("editprofile"));
router.get("/editpw", (req, res) => res.render("editpw"));
router.get("/findid", (req, res) => res.render("findid"));
router.get("/sign", (req, res) => res.render("sign"));
router.get("/login", (req, res) => res.render("login"));
router.get("/main", (req, res) => res.render("main"));

module.exports = router;
