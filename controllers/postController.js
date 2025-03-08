const { Category, Post } = require("../models");

// 게시글 생성
module.exports = {
  createPost: async (req, res) => {
    try {
      console.log("Request Body:", req.body); // 텍스트 데이터
      console.log("Uploaded File:", req.file); // 파일 데이터

      const userId = req.user ? req.user.id : null; // 로그인된 사용자의 ID

      if (!userId) {
        return res.status(403).json({
          success: false,
          message: "로그인이 필요합니다.",
        });
      }

      // 필수 항목 검증
      const { title, content, categoryName } = req.body; // categoryName을 받음
      if (!title || !content || !categoryName) {
        return res.status(400).json({
          success: false,
          message: "필수 항목이 누락되었습니다.",
        });
      }

      // categoryName으로 카테고리 찾기
      const category = await Category.findOne({
        where: { name: categoryName.trim() }, // categoryName으로 검색
      });

      if (!category) {
        return res.status(400).json({
          success: false,
          message: "유효하지 않은 카테고리입니다.",
        });
      }

      // 이미지 파일 처리
      let mainimage = null;
      if (req.file) {
        mainimage = `/uploads/boardimages/${req.file.filename}`; // 업로드된 이미지 경로
      }

      // 게시글 생성
      const newPost = await Post.create({
        title,
        content,
        categoryId: category.id, // 카테고리 ID 사용
        userId,
        mainimage,
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
        error: error.message,
      });
    }
  },

  // 게시글 목록 조회
  getPosts: async (req, res) => {
    try {
      // 게시글을 조회하면서 Category를 include하여 카테고리 정보도 함께 가져오기
      const posts = await Post.findAll({
        include: [
          {
            model: Category,
            as: "category", // alias가 "category"로 설정됨
            attributes: ["name"], // 필요한 카테고리의 속성만 가져옴
          },
        ],
        order: [["createdAt", "DESC"]], // 최신순으로 정렬
      });

      res.status(200).json({
        success: true,
        posts,
      });
    } catch (error) {
      console.error("게시글 조회 오류:", error);
      res.status(500).json({
        success: false,
        message: "게시글 목록을 가져오는 데 오류가 발생했습니다.",
        error: error.message,
      });
    }
  },
};
