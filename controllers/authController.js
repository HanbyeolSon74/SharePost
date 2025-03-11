const { User } = require("../models");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  // 🔑 로그인
  login: async (req, res) => {
    try {
      console.log("🔹 로그인 요청 body:", req.body);

      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ success: false, message: "이메일과 비밀번호를 입력하세요." });
      }

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "이메일이 존재하지 않습니다." });
      }

      if (user.socialType && user.socialType !== "local") {
        return res.status(400).json({
          success: false,
          message: `이메일이 ${user.socialType} 계정과 연결되어 있습니다.`,
        });
      }

      if (!user.password) {
        return res.status(400).json({
          success: false,
          message: "비밀번호가 설정되지 않은 계정입니다.",
        });
      }

      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, message: "비밀번호가 일치하지 않습니다." });
      }

      // 🔑 액세스 토큰 생성 (1시간)
      const accessToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // 🔄 리프레시 토큰 생성 (7일)
      const refreshToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // 🍪 리프레시 토큰을 쿠키에 저장
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // HTTPS에서만 Secure 옵션 활성화
        sameSite: "None", // SameSite 설정
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7일 동안 쿠키 유지
      });

      // 🍪 액세스 토큰을 쿠키에 저장
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // HTTPS에서만 Secure 옵션 활성화
        sameSite: "None", // SameSite 설정
        maxAge: 1 * 60 * 60 * 1000, // 1시간 동안 쿠키 유지
      });

      // ✅ 액세스 토큰 반환
      res.json({ success: true, message: "로그인 성공!" });
    } catch (error) {
      console.error("로그인 오류:", error);
      res.status(500).json({ success: false, message: "서버 오류 발생" });
    }
  },

  // 🚪 로그아웃 (리프레시 토큰 삭제)
  logout: (req, res) => {
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken"); // 액세스 토큰도 쿠키에서 삭제
    res.json({ success: true, message: "로그아웃 성공" });
  },

  // 🔍 액세스 토큰 검증
  verifyAccessToken: (req, res) => {
    const token = req.cookies.accessToken; // 쿠키에서 액세스 토큰 가져오기

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "토큰이 없습니다." });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.json({ success: true, user: decoded });
    } catch (error) {
      res
        .status(401)
        .json({ success: false, message: "유효하지 않은 토큰입니다." });
    }
  },

  // ♻️ 액세스 토큰 갱신
  refreshAccessToken: (req, res) => {
    const refreshToken = req.cookies.refreshToken; // 쿠키에서 리프레시 토큰 가져오기

    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "리프레시 토큰이 없습니다." });
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
      const newAccessToken = jwt.sign(
        { id: decoded.id, email: decoded.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ success: true, newAccessToken });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "리프레시 토큰이 만료되었습니다. 다시 로그인해주세요.",
        });
      }
      res.status(401).json({
        success: false,
        message: "유효하지 않은 리프레시 토큰입니다.",
      });
    }
  },

  // 🔄 자동 토큰 갱신 (만료 임박 시)
  autoRefreshToken: (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "리프레시 토큰이 없습니다." });
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

      const expTime = decoded.exp * 1000 - Date.now();
      if (expTime > 10 * 60 * 1000) {
        return res.json({ success: true, message: "토큰이 아직 유효합니다." });
      }

      const newAccessToken = jwt.sign(
        { id: decoded.id, email: decoded.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ success: true, newAccessToken });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "유효하지 않은 리프레시 토큰입니다.",
      });
    }
  },
};
