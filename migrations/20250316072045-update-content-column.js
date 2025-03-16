module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("posts", "content", {
      type: Sequelize.TEXT("long"), // 기존 TEXT에서 LONGTEXT로 변경
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("posts", "content", {
      type: Sequelize.TEXT, // 원래대로 TEXT로 복구 (필요 시)
      allowNull: false,
    });
  },
};
