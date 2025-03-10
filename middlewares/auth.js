const jwt = require("jsonwebtoken");
const { User } = require("../models");

// 토큰 검증 미들웨어
function verifyToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1]; // Authorization 헤더에서 토큰 추출

  if (!token) {
    console.log("토큰 없음"); // 토큰이 없을 때 로그 출력
    return res.status(403).json({ message: "로그인이 필요합니다." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("토큰 검증 실패:", err); // 토큰 검증 실패 시 오류 출력
      return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    }

    req.user = decoded; // 로그인된 사용자의 정보를 `req.user`에 담기
    console.log("토큰 검증 성공:", decoded); // 토큰이 유효한 경우 decoded 정보 출력
    next(); // 다음 미들웨어로 이동
  });
}

// 로그인 여부 확인 미들웨어
function isLoggedIn(req, res, next) {
  if (req.user) {
    return next(); // 로그인 상태면, 다음 미들웨어로 이동
  }
  res.redirect("/"); // 로그인 안 되어 있으면 로그인 페이지로 리디렉션
}

// 비로그인 상태 확인 미들웨어
function isNotLoggedIn(req, res, next) {
  if (!req.user) {
    return next(); // 로그인 안 되어 있으면, 다음 미들웨어로 이동
  }
  res.redirect("/editprofile"); // 로그인 되어 있으면, 홈 페이지로 리디렉션
}

module.exports = { verifyToken, isLoggedIn, isNotLoggedIn };
