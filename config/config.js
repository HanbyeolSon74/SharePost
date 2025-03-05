require("dotenv").config(); // .env 파일 로드

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE, // DBuser로 설정
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    imageStoragePath: process.env.IMAGE_STORAGE_PATH,
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE, // DBuser로 설정
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    imageStoragePath: process.env.IMAGE_STORAGE_PATH,
  },
};
