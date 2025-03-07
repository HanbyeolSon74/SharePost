const axios = require("axios");
const { User } = require("../models");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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

    const userResponse = await axios.get(
      "https://openapi.naver.com/v1/nid/me",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const userData = userResponse.data.response;

    let user = await User.findOne({ where: { email: userData.email } });

    if (!user) {
      try {
        user = await User.create({
          name: userData.name,
          email: userData.email,
          gender: userData.gender,
          profile_pic: userData.profile_image,
          naver_id: userData.id,
        });
      } catch (error) {
        console.error("사용자 생성 실패:", error);
        return res.status(500).send("사용자 생성 실패");
      }
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.redirect(`/welcome?token=${token}`);
  } catch (error) {
    console.error("네이버 로그인 실패:", error);
    res.status(500).send("네이버 로그인 실패");
  }
};
