const axios = require("axios");

module.exports = {
  // 네이버 로그인 콜백
  naverLoginCallback: async (req, res) => {
    const { code, state } = req.query;
    const clientId = process.env.NAVER_CLIENT_ID;
    const clientSecret = process.env.NAVER_CLIENT_SECRET;
    const redirectUri = process.env.NAVER_REDIRECT_URI;

    // 네이버 토큰 요청
    try {
      const tokenResponse = await axios.post(
        "https://nid.naver.com/oauth2.0/token",
        null,
        {
          params: {
            grant_type: "authorization_code",
            client_id: clientId,
            client_secret: clientSecret,
            code,
            state,
          },
        }
      );

      const { access_token } = tokenResponse.data;

      // 네이버 API를 통해 사용자 정보 가져오기
      const userInfoResponse = await axios.get(
        "https://openapi.naver.com/v1/nid/me",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      const userInfo = userInfoResponse.data.response;

      // DB에 저장할 사용자 정보 준비
      const { id, nickname, email, profile_image } = userInfo;

      let user = await User.findOne({ where: { naver_id: id } });

      // 네이버 로그인 시 이미 존재하는 유저는 업데이트, 아니면 새로 생성
      if (!user) {
        user = await User.create({
          naver_id: id,
          naver_nickname: nickname,
          email,
          profile_pic: profile_image,
          naver_email_verified: true,
        });
      } else {
        // 사용자 정보 업데이트
        user.naver_nickname = nickname;
        user.profile_pic = profile_image;
        await user.save();
      }

      // 로그인 상태 유지 및 사용자 정보 응답
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ success: true, message: "로그인 성공!", token });
    } catch (error) {
      console.error("네이버 로그인 오류:", error);
      res.status(500).json({ success: false, message: "로그인 실패" });
    }
  },
};
