const axios = require("axios");
const { User } = require("../models");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  kakaoCallback: async (req, res) => {
    try {
      const { accessToken } = req.body;

      if (!accessToken) {
        return res
          .status(400)
          .json({ success: false, message: "액세스 토큰이 없습니다." });
      }

      // 1️⃣ 카카오 API에서 사용자 정보 가져오기
      const userResponse = await axios.get(
        "https://kapi.kakao.com/v2/user/me",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const kakaoUser = userResponse.data;
      console.log("카카오 사용자 정보:", kakaoUser);

      const email = kakaoUser.kakao_account?.email; // 이메일만 받기

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "이메일 정보가 없습니다. 이메일이 필요합니다.",
        });
      }

      // 2️⃣ DB에서 이메일 확인
      let user = await User.findOne({ where: { email } });

      if (!user) {
        // 없으면 회원가입 처리
        user = await User.create({
          name: "카카오 사용자", // 기본값
          email: email,
          phone: "000-0000-0000", // 기본값
          password: "kakao_login", // 소셜 로그인용 기본 비밀번호 (사용되지 않음)
          gender: "O", // 기본값
          birthDate: "2000-01-01", // 기본값
          socialType: "kakao",
        });
      }

      // 3️⃣ JWT 토큰 생성
      const newAccessToken = jwt.sign(
        { id: user.id, email: user.email, socialType: user.socialType },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // 4️⃣ JWT 토큰을 클라이언트에 전달
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 3600000,
      });

      res.redirect("/profile/update"); // 로그인 성공 후 프로필 수정 페이지로 이동
    } catch (error) {
      console.error("카카오 로그인 오류:", error);
      res.status(500).json({ success: false, message: "카카오 로그인 실패" });
    }
  },
};
