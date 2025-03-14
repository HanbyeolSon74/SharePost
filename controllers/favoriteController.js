const { Favorite, Post, User } = require("../models");
const jwt = require("jsonwebtoken");
module.exports = {
  // JSON 응답용 좋아요한 게시물 조회
  getPostList: async (req, res) => {
    try {
      const userId = req.user ? req.user.id : null;
      const { page = 1, limit = 12, category = "ALL" } = req.query;

      const whereCondition = category !== "ALL" ? { category } : {};

      // 게시물 조회
      const posts = await Post.findAll({
        where: whereCondition,
        limit: parseInt(limit),
        offset: (page - 1) * limit,
        attributes: ["id", "title", "content", "mainimage", "likes"],
        include: [
          {
            model: Favorite,
            as: "favorites",
            attributes: ["id", "userId"],
          },
        ],
      });

      // 게시물마다 현재 사용자가 좋아요했는지 여부 추가
      const postsWithLikeStatus = posts.map((post) => {
        console.log(post.favorites); // 🔥 여기에 userId가 있는지 확인
        const isLiked = userId
          ? post.favorites.some((fav) => fav.userId === userId)
          : false;
        return {
          ...post.toJSON(),
          isLiked, // ✅ 좋아요 여부 추가
        };
      });

      const totalPages = Math.ceil(posts.length / limit);

      res.json({ success: true, posts: postsWithLikeStatus, totalPages });
    } catch (error) {
      console.error("게시물 목록 조회 실패:", error);
      res.status(500).json({ success: false, message: "서버 오류 발생" });
    }
  },

  // 좋아요한 게시물 페이지 렌더링 (EJS)
  likePage: (req, res) => {
    res.render("mylike");
  },
  renderLikedPosts: async (req, res) => {
    try {
      if (req.cookies.accessToken) {
        let accessToken = req.cookies.accessToken;
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        const user = await User.findOne({ where: { email: decoded.email } });
        const likePost = await Favorite.findAll({ where: { userId: user.id } });

        res.json(likePage);
      }
    } catch (error) {
      console.error("좋아요한 게시물 조회 실패:", error);
      res.status(500).send("서버 오류 발생");
    }
  },

  // 좋아요 추가/취소 기능
  toggleLike: async (req, res) => {
    try {
      const userId = req.user.id;
      const postId = req.params.postId;

      const favorite = await Favorite.findOne({ where: { userId, postId } });

      if (favorite) {
        await favorite.destroy(); // 이미 좋아요한 경우 -> 삭제
        await Post.decrement("likes", { where: { id: postId } }); // 좋아요 수 감소
      } else {
        await Favorite.create({ userId, postId }); // 좋아요 추가
        await Post.increment("likes", { where: { id: postId } }); // 좋아요 수 증가
      }

      // 변경된 좋아요 수 가져오기
      const updatedPost = await Post.findByPk(postId, {
        attributes: ["likes"],
      });

      res.json({
        success: true,
        liked: !favorite,
        likeCount: updatedPost.likes,
      });
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
      res.status(500).json({ success: false, message: "서버 오류 발생" });
    }
  },

  // 상세 게시물 조회 (좋아요 수 및 현재 사용자의 좋아요 상태 포함)
  getPostDetail: async (req, res) => {
    try {
      const userId = req.user ? req.user.id : null;
      const postId = req.params.postId;

      // 게시물 조회 (좋아요 수 포함)
      const post = await Post.findByPk(postId, {
        include: [
          {
            model: Favorite,
            as: "favorites",
            attributes: ["id"],
          },
        ],
      });

      if (!post) {
        return res
          .status(404)
          .json({ success: false, message: "게시물이 존재하지 않습니다." });
      }

      // 좋아요 수 계산
      const likeCount = post.favorites.length;

      // 현재 사용자의 좋아요 상태 확인
      let isLiked = false;
      if (userId) {
        const favorite = await Favorite.findOne({ where: { userId, postId } });
        isLiked = !!favorite;
      }

      res.render("detail", {
        post,
        likeCount,
        isLiked, // ✅ 좋아요 여부 추가
        headerData: {
          naverClientId: process.env.NAVER_CLIENT_ID,
          naverCallbackUrl: process.env.NAVER_CALLBACK_URL,
        },
      });
    } catch (error) {
      console.error("상세 게시물 조회 실패:", error);
      res.status(500).send("서버 오류 발생");
    }
  },

  // 좋아요 상태 확인 API (추가)
  getLikeStatus: async (req, res) => {
    try {
      const userId = req.user.id;
      const postId = req.params.postId;

      // 현재 사용자가 이 게시물을 좋아요 했는지 확인
      const favorite = await Favorite.findOne({ where: { userId, postId } });

      // 현재 게시물의 좋아요 수 가져오기
      const likeCount = await Favorite.count({ where: { postId } });

      res.json({
        success: true,
        liked: !favorite, // 좋아요 여부 (true / false)
        likeCount,
      });
    } catch (error) {
      console.error("좋아요 상태 확인 실패:", error);
      res.status(500).json({ success: false, message: "서버 오류 발생" });
    }
  },
};
