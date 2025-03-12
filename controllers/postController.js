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
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;
      const offset = (page - 1) * limit;
      const selectedCategory = req.query.category || "ALL"; // 카테고리가 주어지지 않으면 "ALL"

      // 카테고리에 따른 조건 처리
      const whereCondition =
        selectedCategory !== "ALL" ? { name: selectedCategory } : {};

      const { count, rows } = await Post.findAndCountAll({
        include: [
          {
            model: Category,
            as: "category",
            attributes: ["name"],
            where: whereCondition, // 카테고리 필터링
          },
        ],
        order: [["createdAt", "DESC"]],
        limit,
        offset,
      });

      const totalPages = Math.ceil(count / limit);

      res.status(200).json({
        success: true,
        posts: rows,
        totalItems: count,
        totalPages,
        currentPage: page,
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
      const postId = req.params.id;
      const post = await Post.findByPk(postId, {
        include: [{ model: Category, as: "category", attributes: ["name"] }],
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

  // 게시글 상세 페이지 렌더링
  getPostPage: async (req, res) => {
    try {
      const postId = req.params.id;
      const post = await Post.findByPk(postId, {
        include: [{ model: Category, as: "category", attributes: ["name"] }],
      });

      if (!post) {
        return res.status(404).render("404");
      }

      res.render("post", {
        post,
        headerData: {
          naverClientId: process.env.NAVER_CLIENT_ID,
          naverCallbackUrl: process.env.NAVER_CALLBACK_URL,
        },
      });
    } catch (error) {
      console.error("게시글 페이지 렌더링 오류:", error);
      res.status(500).json({ message: "서버 오류" });
    }
  },

  // 게시글 수정
  updatePost: async (req, res) => {
    try {
      const postId = req.body.id;
      const { title, content, categoryName } = req.body;

      const post = await Post.findByPk(postId);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: "게시글을 찾을 수 없습니다.",
        });
      }

      const category = await Category.findOne({
        where: { name: categoryName.trim() },
      });
      if (!category) {
        return res.status(400).json({
          success: false,
          message: "유효하지 않은 카테고리입니다.",
        });
      }

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

  // 게시글 수정 페이지 렌더링
  editPostPage: async (req, res) => {
    const postId = req.params.id;

    try {
      const post = await Post.findByPk(postId);
      if (!post) {
        return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
      }

      const categories = await Category.findAll();

      res.render("editPost", {
        post,
        categories,
      });
    } catch (error) {
      console.error("게시글 수정 페이지 조회 오류:", error);
      res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
  },
  // 내 게시글 조회
  getMyPosts: async (req, res) => {
    try {
      const userId = req.user ? req.user.id : null;

      if (!userId) {
        return res.status(403).json({
          success: false,
          message: "로그인이 필요합니다.",
        });
      }

      // 로그인한 사용자가 작성한 게시글 조회
      const posts = await Post.findAll({
        where: {
          userId: userId,
        },
        order: [["createdAt", "DESC"]],
      });

      if (posts.length === 0) {
        return res.status(200).json({
          success: true,
          posts: posts,
          message: "작성한 게시글이 없습니다.",
          posts: [],
        });
      }

      res.status(200).json({
        success: true,
        posts,
      });
    } catch (error) {
      console.error("내 게시글 조회 오류:", error);
      res.status(500).json({
        success: false,
        message: "내 게시글을 조회하는 데 오류가 발생했습니다.",
        error: error.message,
      });
    }
  },

  // 좋아요 기능
  likePost: async (req, res) => {
    try {
      const postId = req.params.id;
      const post = await Post.findByPk(postId);

      if (!post) {
        return res.status(404).send("게시물이 존재하지 않습니다.");
      }

      if (post.likes === null) {
        post.likes = 0;
      }

      const isLiked = req.body.isLiked;

      if (isLiked) {
        post.likes += 1;
      } else {
        post.likes = post.likes > 0 ? post.likes - 1 : 0;
      }

      await post.save();

      res.json({
        success: true,
        likes: post.likes,
      });
    } catch (error) {
      console.error("좋아요 처리 오류:", error);
      res.status(500).send("서버 오류");
    }
  },
  deletePost: async (req, res) => {
    const postId = req.body.id;
    const userId = req.user.id; // 로그인된 사용자 ID

    try {
      // 게시글 조회
      const post = await Post.findByPk(postId);
      if (!post) {
        return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
      }

      // 게시글 소유자가 맞는지 확인
      if (post.userId !== userId) {
        return res
          .status(403)
          .json({ message: "게시글 삭제 권한이 없습니다." });
      }

      // 게시글 삭제
      await post.destroy();
      return res
        .status(200)
        .json({ success: true, message: "게시글이 삭제되었습니다." });
    } catch (error) {
      console.error("게시글 삭제 오류:", error);
      return res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
  },
};
