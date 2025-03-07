"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. naver_id 컬럼의 이름을 naverId로 변경
    await queryInterface.renameColumn("Users", "naver_id", "naverId");

    // 2. kakaoId 컬럼 추가
    await queryInterface.addColumn("Users", "kakaoId", {
      type: Sequelize.STRING(255),
      allowNull: true, // 카카오 로그인만 사용하는 경우 null을 허용
      unique: true, // 중복된 카카오 ID는 허용되지 않도록 설정
    });
  },

  down: async (queryInterface, Sequelize) => {
    // 롤백 시 naverId 컬럼 이름을 원래대로 변경
    await queryInterface.renameColumn("Users", "naverId", "naver_id");

    // kakaoId 컬럼 제거
    await queryInterface.removeColumn("Users", "kakaoId");
  },
};
