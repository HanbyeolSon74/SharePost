const { User, Post } = require("../models");
const bcrypt = require("bcryptjs");

// 내 정보 수정 페이지 렌더링
exports.getProfilePage = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).send("사용자를 찾을 수 없습니다.");

    // birthDate가 문자열이면 Date 객체로 변환
    if (typeof user.birthDate === "string") {
      user.birthDate = new Date(user.birthDate); // Date 객체로 변환
    }

    // 프로필 정보와 함께 페이지 렌더링
    res.render("editprofile", { user });
  } catch (error) {
    console.error("내 정보 페이지 불러오기 실패:", error);
    res.status(500).send("서버 오류 발생");
  }
};

// 회원 정보 수정
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address, password, birthDate } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) return res.status(404).send("사용자를 찾을 수 없습니다.");

    // 비밀번호가 변경되었을 경우, 비밀번호 암호화
    let hashedPassword = user.password;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    // 프로필 이미지가 업로드 되면 새로운 이미지 경로로 업데이트
    const imageurl = req.file
      ? `/uploads/profilepics/${req.file.filename}`
      : user.imageurl;

    // 사용자 정보 업데이트
    await user.update({
      name,
      phone,
      address,
      password: hashedPassword,
      birthDate,
      imageurl,
    });

    res.status(200).json({ message: "회원 정보 수정 완료" });
  } catch (error) {
    console.error("회원 정보 수정 실패:", error);
    res.status(500).send("서버 오류 발생");
  }
};

// 비밀번호 변경 (현재 비밀번호 없이)
exports.changePassword = async (req, res) => {
  try {
    // 토큰에서 사용자 정보를 확인
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "사용자가 인증되지 않았습니다." });
    }

    // 새로운 비밀번호가 제대로 전달되었는지 확인
    const { newPassword, confirmNewPassword } = req.body;

    if (!newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: "모든 필드를 입력해야 합니다." });
    }

    if (newPassword !== confirmNewPassword) {
      return res
        .status(400)
        .json({ message: "새 비밀번호와 확인 비밀번호가 일치하지 않습니다." });
    }

    // 새로운 비밀번호를 암호화하여 DB에 업데이트
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 사용자 정보를 DB에서 찾아 비밀번호 업데이트
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "비밀번호가 성공적으로 변경되었습니다." });
  } catch (error) {
    console.error("비밀번호 변경 실패:", error);
    res.status(500).json({ message: "비밀번호 변경 중 오류가 발생했습니다." });
  }
};

// 회원 탈퇴
exports.deleteProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).send("사용자를 찾을 수 없습니다.");

    // 사용자 삭제
    await user.destroy();
    res.status(200).json({ message: "회원 탈퇴 완료" });
  } catch (error) {
    console.error("회원 탈퇴 실패:", error);
    res.status(500).send("서버 오류 발생");
  }
};

// 내 게시물 조회
exports.getUserPosts = async (req, res) => {
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
};

// 클라이언트에서 받은 게시물 데이터를 렌더링
exports.renderPosts = (req, res) => {
  const posts = req.body.posts || [];

  try {
    // ejs 템플릿 렌더링
    res.render("myposts", { posts });
  } catch (error) {
    console.error("게시글 렌더링 실패:", error);
    res.status(500).send("서버 오류 발생");
  }
};
