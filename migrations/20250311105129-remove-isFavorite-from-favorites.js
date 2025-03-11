"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // isFavorite 컬럼을 삭제
    await queryInterface.removeColumn("favorites", "isFavorite");
  },

  down: async (queryInterface, Sequelize) => {
    // 삭제된 컬럼을 되돌리려면 다시 추가해야함
    await queryInterface.addColumn("favorites", "isFavorite", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },
};
