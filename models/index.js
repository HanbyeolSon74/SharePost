"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    logging: false, // SQL 쿼리 로그 숨김
  });
}

// 모델을 불러오고 실행
fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
  )
  .forEach((file) => {
    const model = require(path.join(__dirname, file)); // 모델을 불러옴
    if (typeof model === "function") {
      const initializedModel = model(sequelize, Sequelize.DataTypes);
      if (initializedModel.name) {
        db[initializedModel.name] = initializedModel;
      } else {
        console.warn(`⚠️ 모델 이름이 없습니다: ${file}`);
      }
    } else {
      console.warn(`⚠️ 모델이 함수가 아닙니다: ${file}`);
    }
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db); // 관계 설정
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

console.log("📌 Loaded models:", Object.keys(db)); // ✅ 로드된 모델 출력
console.log("✅ User 모델 존재 여부:", !!db.User); // ✅ User가 db에 등록되었는지 확인

module.exports = db;
