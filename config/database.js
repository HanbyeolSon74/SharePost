const { Sequelize } = require("sequelize");

// 환경 변수에 설정된 DB 정보를 사용하여 데이터베이스 연결
const sequelize = new Sequelize({
  host: process.env.DB_HOST || "localhost", // DB 호스트 (기본값 localhost)
  dialect: "mysql", // 사용할 DB 종류
  username: process.env.DB_USER || "root", // DB 사용자명
  password: process.env.DB_PASSWORD || "1234", // DB 비밀번호
  database: process.env.DB_DATABASE || "bakezy", // DB 이름
  logging: false, // 로그 비활성화 (필요시 활성화 가능)
});

module.exports = sequelize;
