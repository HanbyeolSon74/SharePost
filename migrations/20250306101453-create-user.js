"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Users", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        unique: true,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      gender: {
        type: Sequelize.ENUM("M", "F", "O"), // ENUM 필드를 수동으로 추가!
        allowNull: false,
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      birth_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      profile_pic: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      // 네이버 로그인 관련 컬럼 추가
      naver_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
        unique: true, // 네이버 ID는 유일해야 하므로 unique 설정
      },
      social_type: {
        type: Sequelize.STRING(50),
        allowNull: true, // 소셜 로그인 타입 (네이버의 경우 'naver' 저장)
      },
      access_token: {
        type: Sequelize.STRING(255),
        allowNull: true, // 액세스 토큰은 선택적
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Users");
  },
};
