const axios = require("axios");
const { User } = require("../models"); // User 모델 임포트
require("dotenv").config(); // 환경 변수 로드

// 네이버 로그인 페이지로 리디렉션
exports.redirectToNaver = (req, res) => {
  const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.NAVER_CLIENT_ID}&redirect_uri=${process.env.NAVER_REDIRECT_URI}&state=${process.env.NAVER_STATE}`;
  res.redirect(naverAuthUrl);
};

// 네이버 로그인 후 콜백 처리
exports.handleNaverCallback = async (req, res) => {
  const { code, state } = req.query;

  if (state !== process.env.NAVER_STATE) {
    return res.status(400).send("잘못된 요청입니다.");
  }

  try {
    // 네이버에서 액세스 토큰 요청
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

    const { access_token } = response.data;

    // 액세스 토큰을 사용해 네이버 사용자 정보 요청
    const userResponse = await axios.get(
      "https://openapi.naver.com/v1/nid/me",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const userData = userResponse.data.response;

    // 네이버에서 받은 사용자 정보로 DB에 사용자 생성 또는 로그인 처리
    let user = await User.findOne({ where: { email: userData.email } });

    if (!user) {
      // 새로운 사용자일 경우 DB에 저장
      user = await User.create({
        name: userData.name,
        email: userData.email,
        gender: userData.gender,
        profile_pic: userData.profile_image, // 네이버에서 제공한 프로필 이미지
        naver_id: userData.id, // 네이버 ID 저장
      });
    }

    // 로그인 처리 (JWT 토큰 발급)
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 로그인 성공 후 리디렉션
    res.redirect(`/welcome?token=${token}`);
  } catch (error) {
    console.error("네이버 로그인 실패:", error);
    res.status(500).send("네이버 로그인 실패");
  }
};
