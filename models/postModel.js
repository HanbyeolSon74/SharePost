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
      image_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users", // 외래키 참조
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      category_id: {
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
      timestamps: true, // Sequelize가 자동으로 createdAt, updatedAt을 관리
      createdAt: "createdAt", // 테이블의 컬럼명 설정
      updatedAt: "updatedAt", // 테이블의 컬럼명 설정
    }
  );

  return Post;
};
