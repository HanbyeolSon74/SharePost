module.exports = {
  getFavorites: async (req, res) => {
    try {
      // 즐겨찾기 목록 가져오는 로직
      const favorites = await Favorite.findAll({
        // 즐겨찾기 목록 가져오는 코드
      });

      res.status(200).json({
        success: true,
        favorites,
      });
    } catch (error) {
      console.error("즐겨찾기 조회 오류:", error);
      res.status(500).json({
        success: false,
        message: "즐겨찾기 목록을 가져오는 데 오류가 발생했습니다.",
        error: error.message,
      });
    }
  },
};
