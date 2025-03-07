const { Post } = require("../models");
const path = require("path");

// 게시글 생성
module.exports = {
  createPost: async (req, res) => {
    try {
      // 요청 본문 및 파일 확인 로그 추가
      console.log("Request Body:", req.body); // 폼 데이터 로그
      console.log("Uploaded File:", req.file); // 업로드된 파일 확인

      // 로그인된 사용자 정보에서 user_id 가져오기
      const user_id = req.user ? req.user.id : null; // 로그인된 사용자의 ID

      if (!user_id) {
        return res.status(400).json({
          success: false,
          message: "로그인된 사용자가 아닙니다.",
        });
      }

      const { title, content, category_id } = req.body;

      // 이미지 파일 처리
      let image_url = null;
      if (req.file) {
        image_url = `/uploads/${req.file.filename}`; // 파일 URL 설정
      }

      // 게시글 생성
      const newPost = await Post.create({
        title,
        content,
        category_id,
        user_id,
        image_url,
      });

      res.status(200).json({
        success: true,
        message: "게시글이 성공적으로 등록되었습니다.",
        post: newPost,
      });
    } catch (error) {
      console.error("게시글 생성 오류:", error);
      res.status(500).json({
        success: false,
        message: "서버 오류가 발생했습니다.",
      });
    }
  },

  // 게시글 수정 페이지 (GET)
  editPostPage: async (req, res) => {
    const postId = req.params.id;

    try {
      const post = await Post.findByPk(postId);
      if (!post) {
        return res.status(404).send("게시글을 찾을 수 없습니다.");
      }
      res.render("edit-post", { post });
    } catch (err) {
      console.error(err);
      res.status(500).send("서버 오류");
    }
  },

  // 게시글 수정 처리 (POST)
  updatePost: async (req, res) => {
    const { id, title, category, content, existingImage } = req.body;
    let image = null;

    // 새 이미지를 업로드하거나 기존 이미지를 유지
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    } else {
      image = existingImage || null; // 기존 이미지가 없으면 null로 처리
    }

    try {
      const post = await Post.findByPk(id);
      if (!post) {
        return res.status(404).send("게시글을 찾을 수 없습니다.");
      }

      // 수정된 게시글 정보 저장
      await post.update({
        title,
        category_id: category,
        content,
        image_url: image,
      });

      res.redirect(`/post/${id}`); // 수정된 게시글 페이지로 리디렉션
    } catch (err) {
      console.error(err);
      res.status(500).send("서버 오류");
    }
  },
};
