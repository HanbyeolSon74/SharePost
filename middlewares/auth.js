const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser"); // cookie-parser 추가
const { User } = require("../models");

// 토큰 검증 미들웨어
function verifyToken(req, res, next) {
  console.log("요청된 쿠키:", req.cookies); // 🔥 쿠키 확인용 로그 추가

  if (!req.cookies || !req.cookies.token) {
    console.log("❌ 로그인 필요 - 쿠키 없음");
    return res.status(403).json({ message: "로그인이 필요합니다." });
  }

  const token = req.cookies.token;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("❌ 토큰 검증 실패:", err.message);
      return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    }

    req.user = decoded;
    console.log("✅ 토큰 검증 성공:", decoded);
    next();
  });
}

// 로그인 여부 확인 미들웨어
function isLoggedIn(req, res, next) {
  if (req.user) {
    return next(); // 로그인 상태면, 다음 미들웨어로 이동
  }
  res.redirect("/"); // 로그인 안 되어 있으면 홈으로 리디렉션
}

// 비로그인 상태 확인 미들웨어
function isNotLoggedIn(req, res, next) {
  if (!req.user) {
    return next(); // 로그인 안 되어 있으면, 다음 미들웨어로 이동
  }
  res.redirect("/editprofile"); // 로그인 되어 있으면, 프로필 수정 페이지로 리디렉션
}

module.exports = { verifyToken, isLoggedIn, isNotLoggedIn };
