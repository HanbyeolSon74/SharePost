const { User } = require("../models"); // User 모델 임포트
const bcryptjs = require("bcryptjs"); // bcryptjs 임포트
const moment = require("moment"); // moment 임포트
const jwt = require("jsonwebtoken"); // JWT 토큰 생성
const path = require("path"); // path 모듈 추가
require("dotenv").config(); // 환경 변수 로드

module.exports = {
  // 회원가입
  signup: async (req, res) => {
    try {
      console.log("Request Body:", req.body); // req.body 출력
      console.log("Uploaded File:", req.file); // req.file 출력

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

      // 주소 객체를 문자열로 변환 (주소가 없는 경우 빈 값 설정)
      const fullAddress = address
        ? `${address.fullAddress} ${address.detail} ${address.extra}`
        : "";

      // 회원가입 부분에서 프로필 사진 경로 설정
      let profilePicPath;

      // 파일이 업로드되었으면 업로드된 경로를, 없으면 기본 이미지 경로 설정
      if (req.file) {
        profilePicPath = req.file.path;
      } else {
        profilePicPath = path.join(
          __dirname,
          process.env.IMAGE_STORAGE_PATH,
          process.env.DEFAULT_PROFILE_PIC
        );
      }

      // birth_date 유효성 검사
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

      // 나이 계산
      const age = moment().diff(formattedBirthDate, "years");

      // 유저 데이터 생성
      const newUser = await User.create({
        name,
        phone,
        email,
        password: hashedPassword,
        address: fullAddress, // 빈 값 또는 기본 주소 저장
        gender,
        age,
        birth_date: formattedBirthDate.format("YYYY-MM-DD"), // ISO 형식으로 저장
        profile_pic: profilePicPath, // 프로필 사진 경로 저장
      });

      // 회원가입 성공 응답
      res.json({ success: true, message: "회원가입 성공!", user: newUser });
    } catch (error) {
      console.error(error);

      // 이메일 중복 오류 처리
      if (error.name === "SequelizeUniqueConstraintError") {
        return res
          .status(400)
          .json({ success: false, message: "이미 가입된 이메일입니다." });
      }

      // 기타 오류 처리
      res.status(500).json({ success: false, message: "서버 오류 발생" });
    }
  },

  // 이메일 중복 확인 API
  checkEmail: async (req, res) => {
    const { email } = req.query; // 이메일을 쿼리 파라미터로 받음

    try {
      // 이메일 중복 여부 확인
      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: "이미 가입된 이메일입니다." });
      }

      res.json({ success: true, message: "사용 가능한 이메일입니다." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "서버 오류 발생" });
    }
  },

  // 로그인
  login: async (req, res) => {
    try {
      const { email, password } = req.body; // 사용자 입력 이메일과 비밀번호 받기

      // 이메일로 사용자 조회
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "이메일이 존재하지 않습니다." });
      }

      // 비밀번호 비교
      const isMatch = await bcryptjs.compare(password, user.password); // 입력된 비밀번호와 DB의 비밀번호 비교

      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, message: "비밀번호가 일치하지 않습니다." });
      }

      // 비밀번호가 맞으면 JWT 토큰 생성
      const token = jwt.sign(
        { id: user.id, email: user.email }, // payload (사용자 정보 포함)
        process.env.JWT_SECRET, // 환경 변수에서 JWT 비밀 키 가져오기
        { expiresIn: "1h" } // 1시간 동안 유효
      );

      // 성공적으로 로그인되면 토큰을 응답으로 반환
      res.json({ success: true, message: "로그인 성공!", token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "서버 오류 발생" });
    }
  },

  // 아이디 찾기 기능 (전화번호 기준)
  findId: async (req, res) => {
    const { phone } = req.body; // 전화번호를 요청 본문에서 받음
    try {
      const user = await User.findOne({ where: { phone } }); // 전화번호로 유저 찾기
      if (user) {
        // 유저를 찾았으면 그 이메일을 반환 (아이디로 사용)
        return res.render("findid", {
          userId: user.email, // 찾은 유저의 이메일을 userId로 전달
          message: null, // 메시지는 null로 설정
        });
      } else {
        // 유저를 찾지 못했으면 message에 오류 메시지를 전달
        return res.render("findid", {
          userId: null, // userId는 null로 설정
          message: "등록된 전화번호가 없습니다.", // 오류 메시지
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "서버 오류가 발생했습니다. 다시 시도해 주세요.",
      });
    }
  },

  // 아이디 찾기 페이지
  findIdPage: (req, res) => {
    res.render("findid"); // findid 페이지 렌더링
  },

  // 비밀번호 찾기 페이지
  findPasswordPage: (req, res) => {
    res.render("findpassword"); // findpassword 페이지 렌더링
  },

  // 비밀번호 수정 기능
  resetPassword: async (req, res) => {
    const { email, password } = req.body; // 이메일과 새 비밀번호 받기
    try {
      // 이메일로 사용자 조회
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "등록된 이메일이 없습니다.",
        });
      }

      // 비밀번호 해싱
      const hashedPassword = await bcryptjs.hash(password, 10);

      // 비밀번호 업데이트
      user.password = hashedPassword;
      await user.save();

      return res.json({
        success: true,
        message: "비밀번호가 성공적으로 변경되었습니다.",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "서버 오류가 발생했습니다. 다시 시도해 주세요.",
      });
    }
  },
};
