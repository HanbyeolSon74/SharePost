const { Post } = require("../models");
const path = require("path");

// 게시글 생성
module.exports = {
  createPost: async (req, res) => {
    try {
      console.log("Request Body:", req.body); // 텍스트 데이터
      console.log("Uploaded File:", req.file); // 파일 데이터

      const user_id = req.user ? req.user.id : null; // 로그인된 사용자의 ID

      // 필수 항목 검증
      const { title, content, category_id } = req.body;
      if (!title || !content || !category_id) {
        return res.status(400).json({
          success: false,
          message: "필수 항목이 누락되었습니다.",
        });
      }

      if (!user_id) {
        return res.status(400).json({
          success: false,
          message: "로그인된 사용자가 아닙니다.",
        });
      }

      // 이미지 파일 처리
      let image_url = null;
      if (req.file) {
        image_url = `/uploads/boardimages/${req.file.filename}`; // 업로드된 이미지 경로
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
        error: error.message, // 에러 메시지 추가
      });
    }
  },

  // 게시글 수정 처리 (PUT)
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

      res.status(200).json({
        success: true,
        message: "게시글이 성공적으로 수정되었습니다.",
        post: post,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("서버 오류");
    }
  },
};
