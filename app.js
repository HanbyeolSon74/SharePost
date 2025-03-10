require("dotenv").config(); // .env 파일 로드
const express = require("express");
const sequelize = require("./config/database");
const userRoutes = require("./routers/userRouter"); // 회원 관련
const authRoutes = require("./routers/authRouter"); // 로그인 관련
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
app.use("/auth", authRoutes); // 로그인/로그아웃
app.use("/user", userRoutes); // 회원가입/프로필 수정
app.use("/board", postRoutes); // 게시판 관련
app.use("/", pageRoutes); // EJS 페이지 연결

// 기본 라우트 (메인 페이지)
app.get("/", (req, res) => {
  res.render("main");
});

// 네이버 로그인 URL 생성
const CLIENT_ID = process.env.NAVER_CLIENT_ID;
const CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;
const REDIRECT_URI = process.env.NAVER_REDIRECT_URI;

// 콘솔에 출력해서 확인
console.log(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// 예시: 네이버 로그인 URL을 만들기
const STATE = "some_random_string_for_state"; // CSRF 방지용 임의의 문자열
const naverLoginUrl = `
https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${STATE}`;

console.log("네이버 로그인 URL:", naverLoginUrl);

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
