const { Sequelize, User } = require("../models");
const bcryptjs = require("bcryptjs");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config();

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
        birthDate,
        socialType,
      } = req.body;

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
        : path.join(__dirname, "..", "public", "images", "image.jpg"); // 기본 이미지 경로로 설정

      // birthDate 유효성 검사
      const formattedBirthDate = moment(
        birthDate,
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
        birthDate: formattedBirthDate.format("YYYY-MM-DD"),
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
    const { email } = req.query;

    try {
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
      console.log("🔹 로그인 요청 body:", req.body);

      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ success: false, message: "이메일과 비밀번호를 입력하세요." });
      }

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "이메일이 존재하지 않습니다." });
      }

      if (user.socialType && user.socialType !== "local") {
        return res.status(400).json({
          success: false,
          message: `이메일이 ${user.socialType} 계정과 연결되어 있습니다.`,
        });
      }

      if (!user.password) {
        return res.status(400).json({
          success: false,
          message: "비밀번호가 설정되지 않은 계정입니다.",
        });
      }

      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, message: "비밀번호가 일치하지 않습니다." });
      }

      // JWT 액세스 토큰 생성 (1시간)
      const accessToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // JWT 리프레시 토큰 생성 (1주일)
      const refreshToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // 리프레시 토큰을 쿠키에 저장 (HTTPOnly, Secure, SameSite 옵션 설정)
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7일 동안 유효
      });

      // 액세스 토큰을 클라이언트로 반환
      res.json({ success: true, message: "로그인 성공!", accessToken });
    } catch (error) {
      console.error("로그인 오류:", error);
      res.status(500).json({ success: false, message: "서버 오류 발생" });
    }
  },

  findId: async (req, res) => {
    let { phone } = req.body;

    phone = phone.replace(/-/g, "");

    try {
      const user = await User.findOne({
        where: Sequelize.where(
          Sequelize.fn("REPLACE", Sequelize.col("phone"), "-", ""),
          phone
        ),
      });

      if (user) {
        return res.json({
          success: true,
          userId: user.email,
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

  findIdPage: (req, res) => {
    res.render("findid");
  },

  findPassword: async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "등록된 이메일이 없습니다.",
        });
      }

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

  resetPassword: async (req, res) => {
    const { email, newPassword } = req.body;
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "등록된 이메일이 없습니다.",
        });
      }

      const hashedPassword = await bcryptjs.hash(newPassword, 10);

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
