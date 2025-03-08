const jwt = require("jsonwebtoken");

const refreshAccessToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken; // 쿠키에서 리프레시 토큰 가져오기

  if (!refreshToken) {
    return res
      .status(401)
      .json({ success: false, message: "리프레시 토큰이 없습니다." });
  }

  try {
    // 리프레시 토큰 검증
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    // 리프레시 토큰이 유효한 경우 새로운 액세스 토큰 생성
    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // 액세스 토큰은 1시간 유효
    );

    // 새 액세스 토큰을 클라이언트에 반환
    res.json({ success: true, newAccessToken });
  } catch (error) {
    // 토큰 검증에 실패하면, 토큰 만료 또는 잘못된 토큰 처리
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "리프레시 토큰이 만료되었습니다. 다시 로그인해주세요.",
      });
    }

    // 기타 에러 처리
    return res.status(401).json({
      success: false,
      message: "리프레시 토큰이 유효하지 않습니다.",
    });
  }
};

module.exports = { refreshAccessToken };
