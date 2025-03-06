"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("posts", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      image_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users", // 외래키가 참조하는 테이블
          key: "id", // 참조하는 테이블의 컬럼
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE", // 사용자 삭제 시, 해당 게시글도 삭제
      },
      category_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "categories", // 외래키가 참조하는 카테고리 테이블
          key: "id", // 참조하는 컬럼 (id)
        },
        onUpdate: "CASCADE", // 카테고리 id 변경 시, 해당 게시글의 category_id도 변경
        onDelete: "SET NULL", // 카테고리 삭제 시, 해당 게시글의 category_id를 NULL로 설정
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("posts");
  },
};
