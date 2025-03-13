// models/Post.js
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

    // Favorite과의 관계
    Post.hasMany(models.Favorite, {
      foreignKey: "postId",
      as: "favorites",
    });

    // User와의 관계 설정 (Post는 하나의 User에 속함)
    Post.belongsTo(models.User, {
      foreignKey: "userId", // Post 모델의 userId 필드와 연결
      as: "user", // 가져올 때 사용할 alias 이름
    });
  };

  return Post;
};
