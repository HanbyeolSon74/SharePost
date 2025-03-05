const bcryptjs = require("bcryptjs");
const User = require("../models/userModel");

module.exports = {
  // 회원가입
  signup: async (req, res) => {
    try {
      console.log("Request Body:", req.body); // req.body 출력
      console.log("Uploaded File:", req.file); // req.file 출력

      const { name, phone, email, password, address, gender, age, birth_date } =
        req.body;

      // 이메일 중복 체크
      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: "이미 가입된 이메일입니다." });
      }

      // 비밀번호 해싱
      const hashedPassword = await bcryptjs.hash(password, 10); // bcryptjs로 수정

      // 프로필 사진이 업로드되었으면 그 경로를 저장, 없으면 기본 이미지 경로 설정
      let profilePicPath = req.file
        ? req.file.path
        : "/public/images/image.jpg"; // 기본 이미지 경로

      // 유저 데이터 생성
      const newUser = await User.create({
        name,
        phone,
        email,
        password: hashedPassword,
        address,
        gender,
        age,
        birth_date,
        profile_pic: profilePicPath, // 프로필 사진 경로 저장
      });

      res.json({ success: true, message: "회원가입 성공!", user: newUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "서버 오류 발생" });
    }
  },
};
