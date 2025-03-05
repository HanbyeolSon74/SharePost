require("dotenv").config(); // .env 파일 로드

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    imageStoragePath: process.env.IMAGE_STORAGE_PATH, // .env에서 로컬 이미지 경로 설정
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    imageStoragePath: process.env.IMAGE_STORAGE_PATH, // 프로덕션에서도 로컬 이미지 경로 사용
  },
};
