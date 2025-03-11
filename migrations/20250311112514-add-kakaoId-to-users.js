"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 이곳에서는 kakaoId 컬럼을 추가하는 코드가 삭제됩니다.
  },

  down: async (queryInterface, Sequelize) => {
    // "users" 테이블에서 kakaoId 컬럼을 제거하는 코드
    await queryInterface.removeColumn("users", "kakaoId");
  },
};
