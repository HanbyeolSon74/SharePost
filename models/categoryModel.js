module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true, // 카테고리 이름은 유일해야 합니다.
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      tableName: "categories", // 카테고리 테이블 이름
      timestamps: true, // createdAt, updatedAt 자동 생성
    }
  );

  // 관계 설정
  Category.associate = function (models) {
    // Category는 여러 개의 Post를 가짐
    Category.hasMany(models.Post, {
      foreignKey: "categoryId", // 외래키 이름 설정
      as: "posts", // 연결될 모델 이름
    });
  };

  return Category;
};
