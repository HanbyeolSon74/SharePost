const axios = require("axios");
const { User } = require("../models");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// 네이버 로그인 페이지로 리디렉션
const redirectToNaver = (req, res) => {
  // const state = Math.random().toString(36).substring(7); // 랜덤한 state 값 생성
  // req.session.naverState = state; // session에 저장
  const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.NAVER_CLIENT_ID}&redirect_uri=${process.env.NAVER_REDIRECT_URI}&state=${process.env.NAVER_STATE}`;
  res.redirect(naverAuthUrl);
};

// 네이버 로그인 후 콜백 처리
const handleNaverCallback = async (req, res) => {
  const { code, state } = req.query;

  // state 값 확인 (예시: 세션에 저장한 state 값과 비교)
  // if (!state || state !== req.session.naverState) {
  //   return res.status(400).json({ message: "Invalid state parameter" });
  // }

  if (!code) {
    return res
      .status(400)
      .json({ message: "네이버에서 인증 코드가 전달되지 않았습니다." });
  }

  try {
    // 🔹 네이버 액세스 토큰 요청
    const response = await axios.post(
      "https://nid.naver.com/oauth2.0/token",
      null,
      {
        params: {
          client_id: process.env.NAVER_CLIENT_ID,
          client_secret: process.env.NAVER_CLIENT_SECRET,
          code,
          state,
          grant_type: "authorization_code",
        },
      }
    );

    console.log("네이버 토큰 응답:", response.data); // 로그 추가

    const { access_token } = response.data;
    if (!access_token) {
      return res.status(400).json({ message: "네이버 액세스 토큰 발급 실패" });
    }

    // 🔹 네이버 사용자 정보 요청
    const userResponse = await axios.get(
      "https://openapi.naver.com/v1/nid/me",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const naverUser = userResponse.data.response;
    console.log("네이버 유저 데이터:", naverUser);

    // 🔹 DB에서 이메일 확인
    let user = await User.findOne({ where: { email: naverUser.email } });

    if (!user) {
      // 🔹 기존 사용자가 없으면 새로 가입 처리
      user = await User.create({
        name: naverUser.name,
        email: naverUser.email,
        phone: naverUser.mobile.replace(/-/g, ""), // '-' 제거
        gender: naverUser.gender === "M" ? "M" : "F", // 네이버는 'M' 또는 'F'만 반환
        birthDate: naverUser.birthyear
          ? `${naverUser.birthyear}-${naverUser.birthday}`
          : null, // 생년월일이 있는 경우 변환
        profile_pic: naverUser.profile_image || "/images/image.jpg", // 프로필 이미지 없으면 기본 이미지
        socialType: "naver",
        password: null, // 소셜 로그인은 비밀번호 없음
      });
    }

    // 🔹 JWT 토큰 발급
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 🔹 리프레시 토큰 저장
    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일 유지
    });

    res.json({
      success: true,
      message: "네이버 로그인 성공!",
      accessToken,
      user,
    });
  } catch (error) {
    console.error("네이버 로그인 오류:", error.response?.data || error);
    res.status(500).json({ message: "네이버 로그인 처리 중 오류 발생" });
  }
};

// ✅ 올바르게 exports 하기
module.exports = {
  redirectToNaver,
  handleNaverCallback,
};
