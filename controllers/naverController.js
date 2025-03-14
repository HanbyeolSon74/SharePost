const axios = require("axios");
const { User } = require("../models");
const jwt = require("jsonwebtoken");
require("dotenv").config();

let naverApi = process.env.NAVER_CLIENT_ID;
let naverCallBack = process.env.NAVER_REDIRECT_URI;

// ✅ 네이버 로그인 페이지로 리디렉션
const redirectToNaver = (req, res) => {
  if (!req.session) {
    console.error("🚨 세션이 설정되지 않음!");
    return res.status(500).json({ message: "세션이 설정되지 않았습니다." });
  }

  const state = Math.random().toString(36).substring(7); // 랜덤한 state 값 생성
  req.session.naverState = state;

  const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.NAVER_CLIENT_ID}&redirect_uri=${process.env.NAVER_REDIRECT_URI}&state=${state}`;

  console.log("🔹 네이버 로그인 URL:", naverAuthUrl);
  return res.redirect(naverAuthUrl);
};

// ✅ 네이버 액세스 토큰 요청 함수
const getNaverAccessToken = async (code, state) => {
  try {
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
    return response.data.access_token;
  } catch (error) {
    console.error(
      "🚨 네이버 액세스 토큰 요청 실패:",
      error.response?.data || error
    );
    throw new Error("네이버 액세스 토큰 요청 실패");
  }
};

// ✅ 네이버 사용자 정보 요청 함수
const getNaverUserProfile = async (access_token) => {
  try {
    const response = await axios.get("https://openapi.naver.com/v1/nid/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    return response.data.response;
  } catch (error) {
    console.error(
      "🚨 네이버 사용자 정보 요청 실패:",
      error.response?.data || error
    );
    throw new Error("네이버 사용자 정보 요청 실패");
  }
};

// ✅ 네이버 로그인 후 콜백 처리
const handleNaverCallback = async (req, res) => {
  const { code, state } = req.query;

  if (!state || state !== req.session.naverState) {
    console.error("🚨 상태 값이 일치하지 않음!");
    return res.status(400).json({ message: "Invalid state parameter" });
  }

  if (!code) {
    console.error("🚨 인증 코드가 전달되지 않음!");
    return res
      .status(400)
      .json({ message: "네이버에서 인증 코드가 전달되지 않았습니다." });
  }

  try {
    // 액세스 토큰 발급
    const access_token = await getNaverAccessToken(code, state);
    console.log("🔹 네이버 액세스 토큰:", access_token); // 디버깅 로그

    // 사용자 정보 요청
    const naverUser = await getNaverUserProfile(access_token);
    console.log("🔹 네이버 사용자 정보:", naverUser); // 디버깅 로그

    // 생일 정보 처리
    let birthDate = "1900-01-01"; // 기본값 설정
    if (naverUser.birthyear && naverUser.birthday) {
      const [month, day] = naverUser.birthday.split("-");
      birthDate = `${naverUser.birthyear}-${month}-${day}`;
    }

    // 프로필 이미지가 없다면 기본 이미지를 설정
    const profilePic = naverUser.profile_image || "/images/image.jpg";

    // DB에서 이메일 확인 및 사용자 생성 또는 업데이트
    let user = await User.findOne({ where: { email: naverUser.email } });
    if (!user) {
      user = await User.create({
        name: naverUser.name,
        email: naverUser.email,
        phone: naverUser.mobile ? naverUser.mobile.replace(/-/g, "") : null,
        gender: naverUser.gender === "M" ? "M" : "F",
        birthDate,
        profilePic,
        socialType: "naver",
        password: "",
      });
      console.log("새로운 사용자 등록:", user);
    } else {
      await user.update({ accessToken: access_token, profilePic });
      console.log("기존 사용자 로그인:", user);
    }

    // 세션에 액세스 토큰 저장
    req.session.access_token = access_token;
    console.log("🔹 세션에 액세스 토큰 저장:", req.session.access_token); // 디버깅 로그

    // JWT 토큰 발급
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 로그인 성공 후 리디렉션
    const redirectUrl = process.env.REDIRECT_URL || "http://localhost:3000";
    return res.redirect(`${redirectUrl}?accessToken=${accessToken}`);
  } catch (error) {
    console.error("네이버 로그인 처리 중 오류 발생:", error.message);
    return res.status(500).json({ message: "네이버 로그인 처리 중 오류 발생" });
  }
};

const naverAPI = async (req, res) => {
  res.json({ api: naverApi, cB: naverCallBack });
};

module.exports = {
  redirectToNaver,
  handleNaverCallback,
  naverAPI,
};
