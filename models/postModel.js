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
          model: "users", // 외래키 참조
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      categoryId: {
        type: DataTypes.INTEGER,
        references: {
          model: "categories", // 외래키 참조
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    },
    {
      tableName: "posts", // 테이블 이름을 'posts'로 변경
      timestamps: true, // Sequelize가 자동으로 createdAt, updatedAt을 관리
      createdAt: "createdAt", // 테이블의 컬럼명 설정
      updatedAt: "updatedAt", // 테이블의 컬럼명 설정
    }
  );

  // 관계 설정
  Post.associate = function (models) {
    // Post는 하나의 Category에 속함
    Post.belongsTo(models.Category, {
      foreignKey: "categoryId", // 외래키 이름 설정
      as: "category", // 연결될 모델 이름
    });
  };

  return Post;
};
