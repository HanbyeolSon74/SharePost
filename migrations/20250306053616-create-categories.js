"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("categories", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // 카테고리 초기 값 삽입
    await queryInterface.bulkInsert("categories", [
      { name: "JENNIE COLLAB", created_at: new Date(), updated_at: new Date() },
      {
        name: "NEWJEANS COLLAB",
        created_at: new Date(),
        updated_at: new Date(),
      },
      { name: "SINSA", created_at: new Date(), updated_at: new Date() },
      { name: "BIRTH", created_at: new Date(), updated_at: new Date() },
      { name: "PURPOSE", created_at: new Date(), updated_at: new Date() },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("categories");
  },
};
