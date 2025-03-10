const axios = require("axios");
const { User } = require("../models");
const jwt = require("jsonwebtoken");
require("dotenv").config();

console.log("🚀 NAVER_CLIENT_ID:", process.env.NAVER_CLIENT_ID);
console.log("🚀 NAVER_REDIRECT_URI:", process.env.NAVER_REDIRECT_URI);

// 네이버 로그인 페이지로 리디렉션
const redirectToNaver = (req, res) => {
  console.log("🚀 req.session:", req.session);
  if (!req.session) {
    console.error("🚨 세션이 설정되지 않음!");
    return res.status(500).json({ message: "세션이 설정되지 않았습니다." });
  }

  const state = Math.random().toString(36).substring(7);
  req.session.naverState = state; // session에 저장

  const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.NAVER_CLIENT_ID}&redirect_uri=${process.env.NAVER_REDIRECT_URI}&state=${state}`;

  console.log("🔹 네이버 로그인 URL:", naverAuthUrl);
  res.redirect(naverAuthUrl);
};

// 네이버 로그인 후 콜백 처리
const handleNaverCallback = async (req, res) => {
  const { code, state } = req.query;

  // state 값 확인
  if (!state || state !== req.session.naverState) {
    return res.status(400).json({ message: "Invalid state parameter" });
  }

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

    console.log("네이버 토큰 응답:", response.data);

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

    // 🔹 birthyear + birthday 조합 (YYYY-MM-DD 형식으로 변환)
    let birthDate = "1900-01-01"; // 기본값 설정
    if (naverUser.birthyear && naverUser.birthday) {
      // birthday가 MM-DD 형식이므로 YYYY-MM-DD 형식으로 변환
      const [month, day] = naverUser.birthday.split("-");
      birthDate = `${naverUser.birthyear}-${month}-${day}`;
    }

    if (!user) {
      // 🔹 기존 사용자가 없으면 새로 가입 처리
      user = await User.create({
        name: naverUser.name,
        email: naverUser.email,
        phone: naverUser.mobile ? naverUser.mobile.replace(/-/g, "") : null, // '-' 제거 및 예외 처리
        gender: naverUser.gender === "M" ? "M" : "F",
        birthDate: birthDate, // 🔹 형식 변환된 값 저장
        profilePic: naverUser.profile_image || "/images/image.jpg",
        socialType: "naver",
        password: "", // 빈 문자열로 저장하여 notNull 오류 방지
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

    // 로그인 후 메인 페이지로 리디렉션
    return res.redirect("/"); // 메인 페이지 경로로 리디렉션
  } catch (error) {
    console.error("네이버 로그인 오류:", error.response?.data || error);
    // 이미 응답을 보낸 경우 (중복 응답 방지)
    if (!res.headersSent) {
      res.status(500).json({ message: "네이버 로그인 처리 중 오류 발생" });
    }
  }
};

// ✅ 올바르게 exports 하기
module.exports = {
  redirectToNaver,
  handleNaverCallback,
};
