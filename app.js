require("dotenv").config(); // 환경변수 로드

const express = require("express");
const sequelize = require("./config/database");
const userRoutes = require("./routers/userRouter"); // 회원가입 라우트
const path = require("path"); // path 모듈 추가

const app = express();

// ✅ Body-parser 미들웨어 (라우트 등록 전 호출)
app.use(express.json()); // JSON 요청 처리
app.use(express.urlencoded({ extended: true })); // URL-encoded 데이터 처리

// EJS 설정 (뷰 엔진 사용 시)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // views 경로 설정

// 정적 파일 제공 (CSS, JS, 이미지 등)
app.use(express.static("public"));
app.use("/uploads", express.static("uploads")); // 업로드된 파일 접근

app.use("/user", userRoutes); // /user 경로로 모든 라우터 적용

// 기본 라우트
app.get("/", (req, res) => {
  res.render("sign");
});

// 로그인 페이지
app.get("/login", (req, res) => {
  res.render("login");
});

// DB 연결 확인 및 서버 실행
sequelize
  .sync({ force: false }) // force: false로 변경
  .then(() => {
    console.log("데이터베이스 연결 성공!");
    app.listen(3000, () => console.log("서버 실행 중: http://localhost:3000"));
  })
  .catch((err) => {
    console.error("데이터베이스 연결 실패:", err);
    res.status(500).send("서버 오류 발생");
  });
