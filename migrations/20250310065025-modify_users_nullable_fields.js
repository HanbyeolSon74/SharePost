module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("users", "password", {
      type: Sequelize.STRING,
      allowNull: true, // NULL 허용
    });

    await queryInterface.changeColumn("users", "birthDate", {
      type: Sequelize.DATEONLY,
      allowNull: true, // NULL 허용
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("users", "password", {
      type: Sequelize.STRING,
      allowNull: false, // 원래대로
    });

    await queryInterface.changeColumn("users", "birthDate", {
      type: Sequelize.DATEONLY,
      allowNull: false, // 원래대로
    });
  },
};
