const { Favorite, Post } = require("../models");

module.exports = {
  // JSON 응답용 좋아요한 게시물 조회
  getLikedPosts: async (req, res) => {
    try {
      const userId = req.user.id;

      const favoritePosts = await Favorite.findAll({
        where: { userId },
        include: [
          {
            model: Post,
            as: "post",
            attributes: ["id", "title", "content", "mainimage"],
          },
        ],
      });

      const posts = favoritePosts.map((fav) => fav.post);

      res.json({ success: true, posts });
    } catch (error) {
      console.error("좋아요한 게시물 조회 실패:", error);
      res.status(500).json({ success: false, message: "서버 오류 발생" });
    }
  },

  // 좋아요한 게시물 페이지 렌더링 (EJS)
  renderLikedPosts: async (req, res) => {
    try {
      const userId = req.user.id;

      const favoritePosts = await Favorite.findAll({
        where: { userId },
        include: [
          {
            model: Post,
            as: "post",
            attributes: ["id", "title", "content", "mainimage"],
          },
        ],
      });

      const posts = favoritePosts.map((fav) => fav.post);

      res.render("mylike", {
        posts,
        headerData: {
          naverClientId: process.env.NAVER_CLIENT_ID,
          naverCallbackUrl: process.env.NAVER_CALLBACK_URL,
        },
      });
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
      } else {
        await Favorite.create({ userId, postId }); // 좋아요 추가
      }

      // 변경된 좋아요 목록 반환
      const updatedFavorites = await Favorite.findAll({
        where: { userId },
        include: [
          {
            model: Post,
            as: "post",
            attributes: ["id", "title", "content", "mainimage"],
          },
        ],
      });

      const posts = updatedFavorites.map((fav) => fav.post);

      res.json({ success: true, liked: !favorite, posts });
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
      res.status(500).json({ success: false, message: "서버 오류 발생" });
    }
  },
};
