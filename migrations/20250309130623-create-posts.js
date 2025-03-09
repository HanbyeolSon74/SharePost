module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("posts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
        references: {
          model: "categories", // categories 테이블과 연결
          key: "id",
        },
        onUpdate: "CASCADE", // 카테고리 업데이트 시 반영
        onDelete: "SET NULL", // 카테고리가 삭제되면 카테고리 ID를 NULL로 설정
      },
      mainimage: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users", // users 테이블과 연결
          key: "id",
        },
        onUpdate: "CASCADE", // 사용자 업데이트 시 반영
        onDelete: "CASCADE", // 사용자가 삭제되면 해당 게시물도 삭제
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
};
