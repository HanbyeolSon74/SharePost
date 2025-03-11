module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define("Favorite", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Favorite.associate = (models) => {
    // 관계 정의 (예: User와 Post와의 관계)
    Favorite.belongsTo(models.User, { foreignKey: "userId" });
    Favorite.belongsTo(models.Post, { foreignKey: "postId" });
  };

  return Favorite;
};
