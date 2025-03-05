require("dotenv").config(); // 환경변수 로드
const express = require("express");
const sequelize = require("./config/database");
const userRoutes = require("./routers/userRouter"); // 회원가입 라우트
const upload = require("./config/multer"); // multer 미들웨어 가져오기

const app = express();

// 회원가입 라우트 연결
app.use("/api/users", userRoutes);

// bodyParser 대신 Express 내장 미들웨어 사용
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// EJS 설정 (뷰 엔진 사용 시)
app.set("view engine", "ejs");

// 정적 파일 제공 (CSS, JS, 이미지 등)
app.use(express.static("public"));
app.use("/uploads", express.static("uploads")); // 업로드된 파일 접근

// 기본 라우트
app.get("/", (req, res) => {
  res.render("sign");
});

// DB 연결 확인 및 서버 실행
sequelize
  .sync()
  .then(() => {
    console.log("데이터베이스 연결 성공!");
    app.listen(3000, () => console.log("서버 실행 중: http://localhost:3000"));
  })
  .catch((err) => console.error("데이터베이스 연결 실패:", err));
