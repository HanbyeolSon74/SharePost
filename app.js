require("dotenv").config();
const express = require("express");
const sequelize = require("./config/database");
const userRoutes = require("./routers/userRouter"); // 회원 관련
const postRoutes = require("./routers/postRouter"); // 게시판 관련
const pageRoutes = require("./routers/pageRouter"); // EJS 페이지 라우트
const path = require("path");

const app = express();

// ✅ Body-parser 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ EJS 설정
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ 정적 파일 제공 (CSS, JS, 이미지 등)
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// ✅ 라우터 등록
app.use("/user", userRoutes); // 회원 관련
app.use("/board", postRoutes); // 게시판 관련
app.use("/", pageRoutes); // EJS 페이지 연결

// 기본 라우트 (메인 페이지)
app.get("/", (req, res) => {
  res.render("main");
});

// ✅ DB 연결 및 서버 실행
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공!");
    app.listen(3000, () => console.log("서버 실행 중: http://localhost:3000"));
  })
  .catch((err) => {
    console.error("데이터베이스 연결 실패:", err);
  });
