"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 카테고리 데이터 배열
    const categories = [
      {
        id: 1,
        name: "ALL",
        description: "All categories",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: "JENNIE COLLAB",
        description: "Jennie collaboration",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: "NEWJEANS COLLAB",
        description: "NewJeans collaboration",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        name: "SINSA",
        description: "Sinsa category",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        name: "BIRTH",
        description: "Birth category",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 6,
        name: "PURPOSE",
        description: "Purpose category",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // categories 테이블에 데이터 삽입
    await queryInterface.bulkInsert("categories", categories, {});
  },

  down: async (queryInterface, Sequelize) => {
    // 카테고리 데이터 삭제 (되돌리기 작업)
    await queryInterface.bulkDelete("categories", null, {});
  },
};
