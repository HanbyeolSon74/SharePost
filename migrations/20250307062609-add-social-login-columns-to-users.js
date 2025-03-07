"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Users", "naver_id", {
      type: Sequelize.STRING(255),
      allowNull: true, // 네이버 로그인만 사용하는 경우, null을 허용해도 됩니다.
      unique: true, // 중복된 네이버 ID는 허용되지 않도록 설정
    });

    await queryInterface.addColumn("Users", "social_type", {
      type: Sequelize.STRING(50),
      allowNull: true, // 소셜 로그인 타입은 선택적
    });

    await queryInterface.addColumn("Users", "access_token", {
      type: Sequelize.STRING(255),
      allowNull: true, // 액세스 토큰은 선택적
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Users", "naver_id");
    await queryInterface.removeColumn("Users", "social_type");
    await queryInterface.removeColumn("Users", "access_token");
  },
};
