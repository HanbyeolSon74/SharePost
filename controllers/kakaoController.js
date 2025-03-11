const axios = require("axios");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
require("dotenv").config();

module.exports = {
  kakaoLogin: async (req, res) => {
    try {
      const { code } = req.query; // 프론트에서 보낸 인가 코드 받기

      if (!code) {
        return res
          .status(400)
          .json({ success: false, message: "인가 코드가 없습니다." });
      }

      // 1️⃣ 카카오에 access_token 요청
      const tokenResponse = await axios.post(
        "https://kauth.kakao.com/oauth/token",
        null,
        {
          params: {
            grant_type: "authorization_code",
            client_id: process.env.KAKAO_CLIENT_ID, // .env에 저장
            redirect_uri: process.env.KAKAO_REDIRECT_URI, // .env에 저장
            code,
            // client_secret: process.env.KAKAO_CLIENT_SECRET,
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const { access_token } = tokenResponse.data;

      // 2️⃣ 액세스 토큰으로 카카오 사용자 정보 요청
      const userResponse = await axios.get(
        "https://kapi.kakao.com/v2/user/me",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const kakaoUser = userResponse.data;
      console.log("카카오 사용자 정보:", kakaoUser);

      const email = kakaoUser.kakao_account.email;
      const name = kakaoUser.kakao_account.profile.nickname;
      const profile_pic = kakaoUser.kakao_account.profile.profile_image_url;

      // 3️⃣ DB에서 해당 이메일의 유저 확인
      let user = await User.findOne({ where: { email } });

      if (!user) {
        // 없으면 회원가입 처리
        user = await User.create({
          name,
          email,
          profile_pic,
          socialType: "kakao",
        });
      }

      // 4️⃣ JWT 토큰 생성
      const accessToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({
        success: true,
        message: "카카오 로그인 성공!",
        accessToken,
      });
    } catch (error) {
      console.error("카카오 로그인 오류:", error);
      res.status(500).json({ success: false, message: "카카오 로그인 실패" });
    }
  },
};
