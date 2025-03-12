const { User, Post } = require("../models");
const bcrypt = require("bcryptjs");

// 내 정보 수정 페이지 렌더링
exports.getProfilePage = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).send("사용자를 찾을 수 없습니다.");

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
    const { name, phone, address, password, birth_date } = req.body;
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
      birth_date,
      imageurl,
    });

    res.status(200).json({ message: "회원 정보 수정 완료" });
  } catch (error) {
    console.error("회원 정보 수정 실패:", error);
    res.status(500).send("서버 오류 발생");
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

    console.log("게시글 데이터:", posts); // 서버에서 받은 게시글 데이터 확인

    const plainPosts = posts.map((post) => post.toJSON()); // JSON 형식으로 변환
    console.log("plainPosts 데이터:", plainPosts); // 변환된 데이터 확인

    // JSON 형식으로 응답 반환
    res.json({ posts: plainPosts });
  } catch (error) {
    console.error("게시글 불러오기 실패:", error);
    res.status(500).send("서버 오류 발생");
  }
};

// 클라이언트에서 받은 게시물 데이터를 렌더링
exports.renderPosts = async (req, res) => {
  const posts = req.body.posts || [];

  try {
    // ejs 템플릿 렌더링
    const html = await res.render("myposts", { posts });

    // 렌더링된 HTML을 클라이언트로 전송
    res.send(html);
  } catch (error) {
    console.error("게시글 렌더링 실패:", error);
    res.status(500).send("서버 오류 발생");
  }
};
