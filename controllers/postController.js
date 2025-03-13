const { Op } = require("sequelize");
const { Favorite, Category, Post, User } = require("../models");

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
      const selectedCategory = req.query.category || "ALL";

      const whereCondition =
        selectedCategory !== "ALL" ? { name: selectedCategory } : {};

      const { count, rows } = await Post.findAndCountAll({
        include: [
          {
            model: Category,
            as: "category",
            attributes: ["name"],
            where: whereCondition,
          },
          {
            model: Favorite,
            as: "favorites",
            attributes: ["id"], // 좋아요 수를 구하기 위해 ID만 가져옴
          },
        ],
        order: [["createdAt", "DESC"]],
        limit,
        offset,
      });

      // 좋아요 수 계산
      const postsWithLikeCount = rows.map((post) => ({
        ...post.toJSON(),
        likeCount: post.likes ? post.likes.length : 0,
      }));

      const totalPages = Math.ceil(count / limit);

      res.status(200).json({
        success: true,
        posts: postsWithLikeCount,
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
        include: [
          { model: Category, as: "category", attributes: ["name"] },
          { model: Favorite, as: "favorites", attributes: ["id"] },
          { model: User, as: "user", attributes: ["name", "id"] },
        ],
      });

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "게시글을 찾을 수 없습니다.",
        });
      }

      let canEdit = false;
      if (req.user) {
        const userIdFromToken = req.user.id;
        canEdit = post.userId === userIdFromToken;
      }
      // 좋아요 수 계산
      const likeCount = typeof post.likes === "number" ? post.likes : 0;

      // 사용자 이름과 아이디 포함
      const postWithUser = {
        ...post.toJSON(),
        user: post.user ? { name: post.user.name, id: post.user.id } : null,
      };

      res.status(200).json({
        success: true,
        post: postWithUser,
        likeCount,
        canEdit,
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
      const postId = req.params.id; // URL 파라미터에서 postId 가져오기
      const { title, content, category_id } = req.body; // 클라이언트에서 전달된 데이터 받기
      const post = await Post.findByPk(postId);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "게시글을 찾을 수 없습니다.",
        });
      }

      const category = await Category.findOne({
        where: { name: category_id },
      });

      if (!category) {
        return res.status(400).json({
          success: false,
          message: "유효하지 않은 카테고리입니다.",
        });
      }

      // 이미지 처리 (파일 업로드 부분)
      let imageUrl = post.mainimage; // 기존 이미지 URL

      if (req.file) {
        // 새 이미지를 업로드한 경우
        imageUrl = req.file.path;
      }

      // 게시글 업데이트
      await post.update({
        title,
        content,
        categoryId: category.id,
        mainimage: imageUrl,
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
      const naverClientId = process.env.NAVER_CLIENT_ID;
      const naverCallbackUrl = process.env.NAVER_CALLBACK_URL;
      res.render("editboard", {
        post,
        categories,
        naverClientId,
        naverCallbackUrl,
      });
    } catch (error) {
      console.error("게시글 수정 페이지 조회 오류:", error);
      res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
  },

  // 게시글 검색
  searchPosts: async (req, res) => {
    try {
      // 클라이언트에서 쿼리 파라미터로 받은 searchQuery
      const searchQuery = req.query.searchQuery || "";

      // 검색어가 없거나 빈 문자열일 경우, 400 응답
      if (!searchQuery.trim()) {
        return res.status(400).json({
          success: false,
          message: "검색어를 입력하세요.",
        });
      }

      // 게시글 검색 쿼리: 제목에 검색어가 포함된 게시글 찾기
      const posts = await Post.findAll({
        where: {
          title: {
            [Op.like]: `%${searchQuery}%`, // 제목에서 searchQuery 포함된 게시글 검색
          },
        },
        include: [
          {
            model: Category,
            as: "category",
            attributes: ["name"], // 카테고리 이름 포함
          },
        ],
        order: [["createdAt", "DESC"]], // 최신순 정렬
      });

      // 검색된 게시글이 없다면
      if (posts.length === 0) {
        return res.status(200).json({
          success: true,
          message: "검색된 게시글이 없습니다.",
          posts: [], // 빈 배열 반환
        });
      }

      // 검색된 게시글 반환
      res.status(200).json({
        success: true,
        posts, // 검색된 게시글 목록
        message: `${posts.length}개의 게시글이 검색되었습니다.`,
      });
    } catch (error) {
      console.error("게시글 검색 오류:", error);
      res.status(500).json({
        success: false,
        message: "서버 오류가 발생했습니다.",
        error: error.message,
      });
    }
  },
  // 게시물 삭제 처리
  deletePost: async (req, res) => {
    try {
      const postId = req.body.id; // 게시물 ID를 body에서 가져옵니다.

      // 게시물 찾기
      const post = await Post.findByPk(postId);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "게시글을 찾을 수 없습니다.",
        });
      }

      // 게시물 삭제
      await post.destroy();

      res.status(200).json({
        success: true,
        message: "게시글이 성공적으로 삭제되었습니다.",
      });
    } catch (error) {
      console.error("게시글 삭제 오류:", error);
      res.status(500).json({
        success: false,
        message: "서버 오류가 발생했습니다.",
        error: error.message,
      });
    }
  },
};
