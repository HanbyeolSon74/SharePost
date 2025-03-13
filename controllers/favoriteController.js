const { Favorite, Post, sequelize } = require("../models");

module.exports = {
  // 사용자가 좋아요한 게시물 조회
  getLikedPosts: async (req, res) => {
    try {
      const userId = req.user.id; // 로그인된 사용자 ID
      console.log("로그인된 사용자 ID:", userId); // 디버깅: 로그인된 사용자 ID 출력

      // 사용자 ID로 좋아요한 게시물 조회
      const favorites = await Favorite.findAll({
        where: { userId },
        include: [
          {
            model: Post,
            as: "post", // Post 모델과 연관되어 있는지 확인
            attributes: ["id", "title", "content", "mainimage"],
          },
        ],
      });

      console.log("조회된 좋아요 데이터:", favorites); // 디버깅: 쿼리로 조회된 데이터 확인

      // 좋아요한 게시물이 없으면
      if (favorites.length === 0) {
        return res.status(200).json({
          success: true,
          message: "좋아요한 게시물이 없습니다.!!!!!1",
          posts: [],

          naverClientId: process.env.NAVER_CLIENT_ID, // 네이버 클라이언트 ID 추가
          naverCallbackUrl: process.env.NAVER_CALLBACK_URL, // 네이버 콜백 URL 추가
        });
      }

      // 좋아요한 게시물 목록 생성
      const likedPosts = favorites.map((favorite) => favorite.post); // 첫 번째 Post 객체로 변경

      console.log("좋아요한 게시물 목록:", likedPosts);

      // res.json({
      //   success: true,
      //   posts: likedPosts, // 좋아요한 게시물 목록만 반환
      // });

      // mylike.ejs 렌더링
      res.render("mylike", {
        success: true,
        posts: likedPosts,
        message: "좋아요한 게시물 목록",
        naverClientId: process.env.NAVER_CLIENT_ID, // 네이버 클라이언트 ID 추가
        naverCallbackUrl: process.env.NAVER_CALLBACK_URL, // 네이버 콜백 URL 추가
      });
    } catch (error) {
      console.error("좋아요한 게시물 조회 오류:", error);
      res.status(500).json({
        success: false,
        message: "좋아요한 게시물을 조회하는 데 오류가 발생했습니다.",
        error: error.message,
      });
    }
  },

  // 좋아요 추가 및 취소
  toggleLike: async (req, res) => {
    const transaction = await sequelize.transaction(); // 트랜잭션 시작

    try {
      const userId = req.user.id; // 토큰에서 가져온 유저 ID
      const { postId } = req.params;

      if (!userId) {
        return res.status(403).json({ message: "로그인이 필요합니다." });
      }

      // 게시물이 존재하는지 확인
      const post = await Post.findByPk(postId);
      if (!post) {
        return res.status(404).json({ message: "게시물을 찾을 수 없습니다." });
      }

      // 기존 좋아요 확인
      const existingLike = await Favorite.findOne({
        where: { userId, postId },
        transaction,
      });

      let liked;
      if (existingLike) {
        // 이미 좋아요를 눌렀다면 삭제 (좋아요 취소)
        await existingLike.destroy({ transaction });
        liked = false;

        // 좋아요 수를 1 감소
        await post.update({ likes: post.likes - 1 }, { transaction });
      } else {
        // 좋아요 추가
        await Favorite.create({ userId, postId }, { transaction });
        liked = true;

        // 좋아요 수를 1 증가
        await post.update({ likes: post.likes + 1 }, { transaction });
      }

      // 트랜잭션 커밋
      await transaction.commit();

      // 클라이언트에 좋아요 상태와 좋아요 수 반환
      res.json({
        message: "좋아요 상태 업데이트 성공",
        likes: post.likes, // 최신 좋아요 수
        liked, // 좋아요 상태 (true or false)
      });
    } catch (error) {
      await transaction.rollback(); // 에러 발생 시 롤백
      console.error("좋아요 처리 에러:", error);
      res.status(500).json({ message: "서버 에러 발생" });
    }
  },
};
