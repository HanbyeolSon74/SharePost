// controllers/postController.js
const { Category, Post } = require("../models");

module.exports = {
  // 게시글 생성
  createPost: async (req, res) => {
    try {
      console.log("Request Body:", req.body);
      console.log("Uploaded File:", req.file);

      const userId = req.user ? req.user.id : null;

      if (!userId) {
        return res.status(403).json({
          success: false,
          message: "로그인이 필요합니다.",
        });
      }

      // 필수 항목 검증
      const { title, content, categoryName } = req.body;

      if (!title || !content || !categoryName) {
        return res.status(400).json({
          success: false,
          message: "필수 항목이 누락되었습니다.",
        });
      }

      // categoryName으로 카테고리 찾기
      const category = await Category.findOne({
        where: { name: categoryName.trim() },
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
        mainimage = `/uploads/boardimages/${req.file.filename}`;
      }

      // 게시글 생성
      const newPost = await Post.create({
        title,
        content,
        categoryId: category.id,
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
            as: "category",
            attributes: ["name"],
          },
        ],
        order: [["createdAt", "DESC"]],
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

  // 게시글 상세 조회
  getPost: async (req, res) => {
    try {
      const postId = req.params.id; // URL에서 id 파라미터 받기
      const post = await Post.findByPk(postId, {
        include: [
          {
            model: Category,
            as: "category",
            attributes: ["name"],
          },
        ],
      });

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "게시글을 찾을 수 없습니다.",
        });
      }

      res.status(200).json({
        success: true,
        post,
      });
    } catch (error) {
      console.error("게시글 조회 오류:", error);
      res.status(500).json({
        success: false,
        message: "게시글을 조회하는 데 오류가 발생했습니다.",
        error: error.message,
      });
    }
  },
  //렌더링이 없어서 추가
  getPostPage: async (req, res) => {
    try {
      const postId = req.params.id;
      const post = await Post.findByPk(postId, {
        include: [{ model: Category, as: "category", attributes: ["name"] }],
      });

      if (!post) {
        return res.status(404).render("404"); // 게시글이 없으면 404 페이지
      }

      res.render("post", {
        post,
        naverClientId: process.env.NAVER_CLIENT_ID,
        naverCallbackUrl: process.env.NAVER_CALLBACK_URL,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "서버 오류" });
    }
  },

  // 게시글 수정 (단순히 게시글을 업데이트하는 예시)
  updatePost: async (req, res) => {
    try {
      const postId = req.body.id;
      const { title, content, categoryName } = req.body;

      // 게시글 조회
      const post = await Post.findByPk(postId);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: "게시글을 찾을 수 없습니다.",
        });
      }

      // 카테고리 확인
      const category = await Category.findOne({
        where: { name: categoryName.trim() },
      });
      if (!category) {
        return res.status(400).json({
          success: false,
          message: "유효하지 않은 카테고리입니다.",
        });
      }

      // 게시글 업데이트
      await post.update({
        title,
        content,
        categoryId: category.id,
      });

      res.status(200).json({
        success: true,
        message: "게시글이 성공적으로 수정되었습니다.",
        post,
      });
    } catch (error) {
      console.error("게시글 수정 오류:", error);
      res.status(500).json({
        success: false,
        message: "서버 오류가 발생했습니다.",
        error: error.message,
      });
    }
  },

  // 게시글 수정 페이지 (GET)
  editPostPage: async (req, res) => {
    const postId = req.params.id; // 수정하려는 게시글의 ID를 가져옵니다.

    try {
      // 게시글 조회
      const post = await Post.findByPk(postId);
      if (!post) {
        return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
      }

      // 수정할 게시글의 카테고리 목록을 가져옵니다.
      const categories = await Category.findAll();

      // 게시글과 카테고리 정보를 함께 수정 페이지에 전달
      res.render("editPost", {
        // 'editPost'는 수정 페이지에 해당하는 EJS 파일명
        post,
        categories,
      });
    } catch (error) {
      console.error("게시글 수정 페이지 조회 오류:", error);
      res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
  },

  // 좋아요 처리
  likePost: async (req, res) => {
    try {
      const postId = req.params.id;
      const post = await Post.findByPk(postId);

      if (!post) {
        return res.status(404).send("게시물이 존재하지 않습니다.");
      }

      // likes 값이 null이면 0으로 초기화
      if (post.likes === null) {
        post.likes = 0;
      }

      const isLiked = req.body.isLiked; // true (좋아요), false (좋아요 취소)

      if (isLiked) {
        post.likes += 1; // 좋아요 증가
      } else {
        post.likes = post.likes > 0 ? post.likes - 1 : 0; // 좋아요 취소
      }

      await post.save();

      res.json({
        success: true,
        likes: post.likes, // 업데이트된 좋아요 수 반환
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("서버 오류");
    }
  },
};
