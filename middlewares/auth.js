const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports = {
  verifyToken: (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];

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
  },
};
