const { Favorite, Post, sequelize } = require("../models");

module.exports = {
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
