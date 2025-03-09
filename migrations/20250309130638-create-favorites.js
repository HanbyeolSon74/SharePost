"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("favorites", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users", // users 테이블과 연결
          key: "id",
        },
        onUpdate: "CASCADE", // 사용자가 업데이트 시 반영
        onDelete: "CASCADE", // 사용자가 삭제되면 해당 찜도 삭제
      },
      postId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "posts", // posts 테이블과 연결
          key: "id",
        },
        onUpdate: "CASCADE", // 게시물이 업데이트 시 반영
        onDelete: "CASCADE", // 게시물이 삭제되면 찜도 삭제
      },
      isFavorite: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false, // 기본값 false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },
};
