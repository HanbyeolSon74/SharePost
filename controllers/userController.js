const { Sequelize, User } = require("../models");
const bcryptjs = require("bcryptjs");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config();

module.exports = {
  // 네이버 로그인 관련 처리
  getNaverAuth: (req, res) => {
    try {
      const naverClientId = process.env.NAVER_CLIENT_ID;
      const naverCallbackUrl = process.env.NAVER_CALLBACK_URL;

      if (!naverClientId || !naverCallbackUrl) {
        return res.status(400).json({
          success: false,
          message: "네이버 클라이언트 ID 또는 콜백 URL이 설정되지 않았습니다.",
        });
      }

      res.json({
        success: true,
        naverClientId,
        naverCallbackUrl,
      });
    } catch (error) {
      console.error("네이버 로그인 처리 오류:", error);
      res.status(500).json({ success: false, message: "서버 오류 발생" });
    }
  },

  // 회원가입
  signup: async (req, res) => {
    try {
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
      if (!socialType && password) {
        hashedPassword = await bcryptjs.hash(password, 10);
      } else if (!socialType) {
        return res.status(400).json({
          success: false,
          message: "비밀번호를 입력해주세요.",
        });
      }

      // 주소 문자열로 변환
      const fullAddress = address
        ? `${address.fullAddress} ${address.detail} ${address.extra}`
        : "";

      // 프로필 사진 경로 설정
      const profilePicPath = req.file
        ? req.file.path
        : path.join(__dirname, "..", "public", "images", "image.jpg");

      // 생년월일 유효성 검사 및 나이 계산
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
      const age = moment().diff(formattedBirthDate, "years");

      // 유저 데이터 생성
      const newUser = await User.create({
        name,
        phone,
        email,
        password: hashedPassword,
        address: fullAddress,
        gender,
        age,
        birthDate: formattedBirthDate.format("YYYY-MM-DD"),
        profilePic: profilePicPath, // profilePic 컬럼이 맞는지 확인 필요
        socialType: socialType || "local",
      });

      res.json({ success: true, message: "회원가입 성공!", user: newUser });
    } catch (error) {
      console.error("회원가입 오류:", error);
      if (error.name === "SequelizeUniqueConstraintError") {
        return res
          .status(400)
          .json({ success: false, message: "이미 가입된 이메일입니다." });
      }
      res.status(500).json({ success: false, message: "서버 오류 발생" });
    }
  },

  // 이메일 중복 확인
  checkEmail: async (req, res) => {
    try {
      const { email } = req.query;
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: "이미 가입된 이메일입니다." });
      }
      res.json({ success: true, message: "사용 가능한 이메일입니다." });
    } catch (error) {
      console.error("이메일 중복 확인 오류:", error);
      res.status(500).json({ success: false, message: "서버 오류 발생" });
    }
  },

  // 아이디 찾기
  findId: async (req, res) => {
    try {
      let { phone } = req.body;
      phone = phone.replace(/-/g, "");
      const user = await User.findOne({
        where: Sequelize.where(
          Sequelize.fn("REPLACE", Sequelize.col("phone"), "-", ""),
          phone
        ),
      });

      if (!user) {
        return res.json({
          success: false,
          userId: null,
          message: "등록된 전화번호가 없습니다.",
        });
      }

      res.json({ success: true, userId: user.email });
    } catch (error) {
      console.error("아이디 찾기 오류:", error);
      res.status(500).json({
        success: false,
        message: "서버 오류가 발생했습니다. 다시 시도해 주세요.",
      });
    }
  },

  // 비밀번호 찾기
  findPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "등록된 이메일이 없습니다.",
        });
      }

      res.json({ success: true, message: "새 비밀번호를 설정해주세요." });
    } catch (error) {
      console.error("비밀번호 찾기 오류:", error);
      res.status(500).json({
        success: false,
        message: "서버 오류가 발생했습니다. 다시 시도해 주세요.",
      });
    }
  },

  // 비밀번호 재설정
  resetPassword: async (req, res) => {
    try {
      const { email, newPassword } = req.body;
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

      res.json({
        success: true,
        message: "비밀번호가 성공적으로 변경되었습니다.",
      });
    } catch (error) {
      console.error("비밀번호 재설정 오류:", error);
      res.status(500).json({
        success: false,
        message: "서버 오류가 발생했습니다. 다시 시도해 주세요.",
      });
    }
  },

  // 아이디 찾기 페이지 렌더링
  findIdPage: async (req, res) => {
    try {
      // .env 파일에서 클라이언트 ID와 콜백 URL 가져오기
      const naverClientId = process.env.NAVER_CLIENT_ID;
      const naverCallbackUrl = process.env.NAVER_CALLBACK_URL;

      // findid 페이지로 클라이언트 ID와 콜백 URL 전달
      res.render("findid", {
        success: true,
        naverClientId,
        naverCallbackUrl,
      });
    } catch (error) {
      console.error("아이디 찾기 페이지 렌더링 중 오류 발생:", error);
      res.status(500).send("서버 오류가 발생했습니다.");
    }
  },
  // 사용자 정보를 ID로 가져오는 함수
  getUserById: async (userId) => {
    try {
      const user = await User.findOne({
        where: { id: userId },
        attributes: [
          "id",
          "name",
          "phone",
          "email",
          "address",
          "birth_date",
          "profilePic", // 필드명이 맞는지 확인 필요
        ],
      });

      return user; // 사용자 정보 반환
    } catch (error) {
      console.error("사용자 정보를 가져오는 중 오류 발생:", error);
      return null;
    }
  },

  // 로그인 상태 확인 API
  checkLoginStatus: (req, res) => {
    if (req.user) {
      res.json({
        success: true,
        message: "로그인 상태입니다.",
        user: req.user,
      });
    } else {
      res.json({ success: false, message: "로그인 상태가 아닙니다." });
    }
  },
};
