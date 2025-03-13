module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      mainimage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      categoryId: {
        type: DataTypes.INTEGER,
        references: {
          model: "categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0, // 기본값 0
      },
    },
    {
      tableName: "posts",
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    }
  );

  // 관계 설정
  Post.associate = function (models) {
    // Category와의 관계
    Post.belongsTo(models.Category, {
      foreignKey: "categoryId",
      as: "category",
    });

    // Favorite과의 관계 추가
    Post.hasMany(models.Favorite, {
      foreignKey: "postId",
      as: "favorites",
    });
  };

  return Post;
};
