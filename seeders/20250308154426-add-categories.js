"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Categories", [
      {
        name: "JENNIE COLLAB",
        description: "Collaborations with JENNIE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "NEWJEANS COLLAB",
        description: "Collaborations with NEWJEANS",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "SINSA",
        description: "Sin sa style fashion",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "BIRTH",
        description: "Birthday collections",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "PURPOSE",
        description: "Purpose driven designs",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Categories", null, {}); // 데이터 삭제
  },
};
