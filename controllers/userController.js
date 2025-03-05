const moment = require("moment"); // moment 임포트 추가
const { User } = require("../models"); // User 모델을 임포트
const bcryptjs = require("bcryptjs"); // bcryptjs 임포트 추가

module.exports = {
  // 회원가입
  signup: async (req, res) => {
    try {
      console.log("Request Body:", req.body); // req.body 출력
      console.log("Uploaded File:", req.file); // req.file 출력

      // 필드 추출
      const { name, phone, email, password, address, gender, birth_date } =
        req.body;

      // 이메일 중복 체크
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: "이미 가입된 이메일입니다." });
      }

      // 비밀번호 해싱
      const hashedPassword = await bcryptjs.hash(password, 10);

      // 주소 객체를 문자열로 변환
      const fullAddress = `${address.fullAddress} ${address.detail} ${address.extra}`;

      // 프로필 사진이 업로드되었으면 그 경로를 저장, 없으면 기본 이미지 경로 설정
      let profilePicPath = req.file
        ? req.file.path // 업로드된 이미지가 있으면 그 경로 사용
        : "/public/images/image.jpg"; // 기본 이미지 경로

      // birth_date 유효성 검사 (YYYY-MM-DD 형식으로 변환 후 유효성 검사)
      const formattedBirthDate = moment(
        birth_date,
        ["YYYY-MM-DD", "YYYY-M-D"],
        true
      );
      if (!formattedBirthDate.isValid()) {
        return res
          .status(400)
          .json({ success: false, message: "유효하지 않은 생년월일입니다." });
      }

      // 나이 계산 (생년월일 기준으로 나이 계산)
      const age = moment().diff(formattedBirthDate, "years");

      // 유저 데이터 생성
      const newUser = await User.create({
        name,
        phone,
        email,
        password: hashedPassword,
        address: fullAddress, // 합쳐진 주소 저장
        gender,
        age, // 계산된 나이 저장
        birth_date: formattedBirthDate.format("YYYY-MM-DD"), // 저장할 때는 ISO 형식으로 저장
        profile_pic: profilePicPath, // 프로필 사진 경로 저장
      });

      // 회원가입 성공 응답
      res.json({ success: true, message: "회원가입 성공!", user: newUser });
    } catch (error) {
      console.error(error);

      // 더 구체적인 에러 메시지 전달
      if (error.name === "SequelizeUniqueConstraintError") {
        return res
          .status(400)
          .json({ success: false, message: "이미 가입된 이메일입니다." });
      }

      res.status(500).json({ success: false, message: "서버 오류 발생" });
    }
  },
};
