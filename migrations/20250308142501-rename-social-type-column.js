"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // social_type -> socialType 으로 컬럼명 변경
    await queryInterface.renameColumn("Users", "social_type", "socialType");
  },

  down: async (queryInterface, Sequelize) => {
    // 롤백 시 원래 이름으로 복구
    await queryInterface.renameColumn("Users", "socialType", "social_type");
  },
};
