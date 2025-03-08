const { Sequelize, User } = require("../models");
const bcryptjs = require("bcryptjs"); // bcryptjs 임포트
const moment = require("moment"); // moment 임포트
const jwt = require("jsonwebtoken"); // JWT 토큰 생성
const path = require("path"); // path 모듈 추가
require("dotenv").config(); // 환경 변수 로드

module.exports = {
  // 회원가입
  signup: async (req, res) => {
    try {
      console.log("Request Body:", req.body);
      console.log("Uploaded File:", req.file);

      const {
        name,
        phone,
        email,
        password,
        address,
        gender,
        birth_date,
        socialType,
      } = req.body; // socialType 추가

      // 이메일 중복 체크
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: "이미 가입된 이메일입니다." });
      }

      // 소셜 로그인 사용자는 비밀번호 없이 가입 가능
      let hashedPassword = null;
      if (!socialType) {
        if (!password) {
          return res.status(400).json({
            success: false,
            message: "비밀번호를 입력해주세요.",
          });
        }
        hashedPassword = await bcryptjs.hash(password, 10);
      }

      // 주소 객체를 문자열로 변환
      const fullAddress = address
        ? `${address.fullAddress} ${address.detail} ${address.extra}`
        : "";

      // 프로필 사진 경로 설정
      let profilePicPath = req.file
        ? req.file.path
        : path.join(
            __dirname,
            process.env.IMAGE_STORAGE_PATH,
            process.env.DEFAULT_PROFILE_PIC
          );

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

      // 유저 데이터 생성 (로컬 회원가입 또는 소셜 로그인)
      const newUser = await User.create({
        name,
        phone,
        email,
        password: hashedPassword,
        address: fullAddress,
        gender,
        age,
        birth_date: formattedBirthDate.format("YYYY-MM-DD"),
        profile_pic: profilePicPath,
        socialType: socialType || "local", // 소셜 로그인 사용자는 해당 값 저장, 기본값은 'local'
      });

      res.json({ success: true, message: "회원가입 성공!", user: newUser });
    } catch (error) {
      console.error(error);

      if (error.name === "SequelizeUniqueConstraintError") {
        return res
          .status(400)
          .json({ success: false, message: "이미 가입된 이메일입니다." });
      }

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
      console.log("🔹 로그인 요청 body:", req.body); // 디버깅 추가

      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ success: false, message: "이메일과 비밀번호를 입력하세요." });
      }

      // 이메일로 사용자 조회
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "이메일이 존재하지 않습니다." });
      }

      // 소셜 로그인 유저인지 확인
      if (user.socialType && user.socialType !== "local") {
        return res.status(400).json({
          success: false,
          message: `이메일이 ${user.socialType} 계정과 연결되어 있습니다.`,
        });
      }

      // 비밀번호가 null이면 비교 불가능 (소셜 로그인 유저)
      if (!user.password) {
        return res
          .status(400)
          .json({
            success: false,
            message: "비밀번호가 설정되지 않은 계정입니다.",
          });
      }

      // 비밀번호 비교
      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, message: "비밀번호가 일치하지 않습니다." });
      }

      // JWT 토큰 생성
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ success: true, message: "로그인 성공!", token });
    } catch (error) {
      console.error("로그인 오류:", error);
      res.status(500).json({ success: false, message: "서버 오류 발생" });
    }
  },

  findId: async (req, res) => {
    let { phone } = req.body;

    // 입력된 전화번호에서 하이픈을 제거
    phone = phone.replace(/-/g, "");

    try {
      // DB에서 하이픈을 제거한 phone과 클라이언트에서 받은 phone을 비교
      const user = await User.findOne({
        where: Sequelize.where(
          Sequelize.fn("REPLACE", Sequelize.col("phone"), "-", ""), // DB에서 하이픈을 제거한 값
          phone // 클라이언트에서 받은 전화번호
        ),
      });

      if (user) {
        return res.json({
          success: true,
          userId: user.email, // 해당 유저의 이메일 반환
          message: null,
        });
      } else {
        return res.json({
          success: false,
          userId: null,
          message: "등록된 전화번호가 없습니다.",
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "서버 오류가 발생했습니다. 다시 시도해 주세요.",
      });
    }
  },

  // 아이디 찾기 페이지
  findIdPage: (req, res) => {
    res.render("findid"); // findid 페이지 렌더링
  },

  // 비밀번호 찾기 요청 처리
  findPassword: async (req, res) => {
    const { email } = req.body;
    try {
      // 이메일로 사용자 조회
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "등록된 이메일이 없습니다.",
        });
      }

      // 사용자가 존재하면 새 비밀번호를 설정하라는 메시지 반환
      return res.json({
        success: true,
        message: "새 비밀번호를 설정해주세요.",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "서버 오류가 발생했습니다. 다시 시도해 주세요.",
      });
    }
  },

  // 비밀번호 변경 요청 처리
  resetPassword: async (req, res) => {
    const { email, newPassword } = req.body; // 이메일과 새 비밀번호 받기
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
      const hashedPassword = await bcryptjs.hash(newPassword, 10);

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
