const { User, Post } = require("../models"); // Post 모델 추가
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // bcrypt 모듈 추가

module.exports = {
  // 회원 정보 가져오기
  getProfile: async (req, res) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res
        .status(401)
        .json({ success: false, message: "로그인 후 시도해주세요." });
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
      const user = await User.findOne({ where: { id: decoded.id } });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "사용자를 찾을 수 없습니다.",
        });
      }

      // 네이버 로그인 관련 값 추가
      const naverClientId = process.env.NAVER_CLIENT_ID; // 환경변수에서 가져오기
      const naverCallbackUrl = process.env.NAVER_CALLBACK_URL; // 환경변수에서 가져오기

      // 회원 정보를 profile.ejs로 전달하여 렌더링
      res.render("editprofile", {
        success: true,
        user: {
          email: user.email,
          name: user.name,
          phone: user.phone,
          birthdate: user.birthDate,
          profileImage: user.profilePic,
        },
        naverClientId, // 네이버 클라이언트 ID 전달
        naverCallbackUrl, // 네이버 콜백 URL 전달
      });
    } catch (error) {
      console.error("회원 정보 가져오기 오류:", error);
      res.status(500).json({ success: false, message: "서버 오류 발생" });
    }
  },

  // 회원 정보 수정
  updateProfile: async (req, res) => {
    const { name, phone, birthDate, profilePic } = req.body;
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res
        .status(401)
        .json({ success: false, message: "로그인 후 시도해주세요." });
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
      const userId = decoded.id;

      const user = await User.findOne({ where: { id: userId } });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "사용자를 찾을 수 없습니다." });
      }

      // 이름, 전화번호, 생년월일을 업데이트
      user.name = name || user.name;
      user.phone = phone || user.phone;
      user.birthDate = birthDate || user.birthDate;
      user.profilePic = profilePic || user.profilePic; // 프로필 이미지 수정

      await user.save();

      // 네이버 로그인 관련 값 추가
      const naverClientId = process.env.NAVER_CLIENT_ID; // 환경변수에서 가져오기
      const naverCallbackUrl = process.env.NAVER_CALLBACK_URL; // 환경변수에서 가져오기

      // 수정된 사용자 정보를 렌더링하여 profile 페이지로 전달
      res.render("editprofile", {
        success: true,
        message: "회원 정보가 수정되었습니다.",
        user: {
          email: user.email,
          name: user.name,
          phone: user.phone,
          birthdate: user.birthDate,
          profileImage: user.profilePic,
        },
        naverClientId, // 네이버 클라이언트 ID 전달
        naverCallbackUrl, // 네이버 콜백 URL 전달
      });
    } catch (error) {
      console.error("회원 정보 수정 오류:", error);
      res.status(500).json({ success: false, message: "서버 오류 발생" });
    }
  },

  // 비밀번호 변경
  changePassword: async (req, res) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res
        .status(401)
        .json({ success: false, message: "로그인 후 시도해주세요." });
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
      const userId = decoded.id;

      const { newPassword, confirmNewPassword } = req.body;

      if (!newPassword || !confirmNewPassword) {
        return res
          .status(400)
          .json({ success: false, message: "모든 필드를 입력해야 합니다." });
      }

      if (newPassword !== confirmNewPassword) {
        return res.status(400).json({
          success: false,
          message: "새 비밀번호와 확인 비밀번호가 일치하지 않습니다.",
        });
      }

      // 비밀번호 암호화
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const user = await User.findOne({ where: { id: userId } });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "사용자를 찾을 수 없습니다." });
      }

      user.password = hashedPassword;
      await user.save();

      res.json({ success: true, message: "비밀번호가 변경되었습니다." });
    } catch (error) {
      console.error("비밀번호 변경 오류:", error);
      res.status(500).json({ success: false, message: "서버 오류 발생" });
    }
  },

  // 내 게시물 조회
  getUserPosts: async (req, res) => {
    try {
      const posts = await Post.findAll({
        where: { userId: req.user.id }, // 현재 로그인한 사용자의 게시글만 조회
        order: [["createdAt", "DESC"]], // 최신순으로 정렬
      });

      const plainPosts = posts.map((post) => post.toJSON()); // JSON 형식으로 변환

      // JSON 형식으로 응답 반환
      res.json({ posts: plainPosts });
    } catch (error) {
      console.error("게시글 불러오기 실패:", error);
      res.status(500).send("서버 오류 발생");
    }
  },

  // 회원 탈퇴
  deleteProfile: async (req, res) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res
        .status(401)
        .json({ success: false, message: "로그인 후 시도해주세요." });
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
      const userId = decoded.id;

      const user = await User.findOne({ where: { id: userId } });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "사용자를 찾을 수 없습니다." });
      }

      // 회원 탈퇴
      await user.destroy();
      res.json({ success: true, message: "회원 탈퇴가 완료되었습니다." });
    } catch (error) {
      console.error("회원 탈퇴 오류:", error);
      res.status(500).json({ success: false, message: "서버 오류 발생" });
    }
  },

  // 클라이언트에서 받은 게시물 데이터를 렌더링
  renderPosts: (req, res) => {
    const posts = req.body.posts || [];

    try {
      // ejs 템플릿 렌더링
      res.render("myposts", { posts });
    } catch (error) {
      console.error("게시물 렌더링 오류:", error);
      res.status(500).send("서버 오류 발생");
    }
  },
};
