module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("posts", "likes", {
      type: Sequelize.INTEGER,
      defaultValue: 0, // 기본값을 0으로 설정
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("posts", "likes");
  },
};
