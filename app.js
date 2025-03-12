require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");
const sequelize = require("./config/database");
const cors = require("cors");
const { verifyToken } = require("./middlewares/auth");

// 라우터 임포트
const userRoutes = require("./routers/userRouter");
const authRoutes = require("./routers/authRouter");
const postRoutes = require("./routers/postRouter");
const pageRoutes = require("./routers/pageRouter");
const profileRoutes = require("./routers/profileRouter"); // 추가된 부분

const app = express();

// ✅ Body-parser 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ EJS 설정
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ 정적 파일 제공 (CSS, JS, 이미지 등)
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// ✅ 세션 설정
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === "production" ? true : false }, // 개발 환경에서는 false로 설정
  })
);

// CORS 설정 (전체 애플리케이션에 적용)
app.use(
  cors({
    origin: "http://localhost:3000", // 클라이언트 URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"], // Authorization 헤더를 허용
    credentials: true, // 쿠키와 같은 자격 증명 허용
  })
);

// 서버 코드에서 /get-key 경로 추가
app.get("/get-key", (req, res) => {
  res.json({ key: "your-api-key" }); // 실제 API 키 또는 데이터를 반환
});

app.get("/api/verify-token", verifyToken, (req, res) => {
  res.status(200).json({ message: "토큰이 유효합니다." });
});
// ✅ 라우터 등록
app.use("/auth", authRoutes); // 로그인/로그아웃
app.use("/user", userRoutes); // 회원 관련
app.use("/board", postRoutes); // 게시판 관련
app.use("/profile", profileRoutes); // 추가된 라우터 등록
app.use("/", pageRoutes); // EJS 페이지 연결

// 기본 라우트 (메인 페이지)
app.get("/", (req, res) => {
  res.render("main", {
    naverClientId: process.env.NAVER_CLIENT_ID,
    naverCallbackUrl: process.env.NAVER_CLIENT_SECRET,
  });
});

// ✅ DB 연결 및 서버 실행
sequelize
  .sync({ force: false }) // DB 테이블을 덮어쓰지 않도록 설정
  .then(() => {
    console.log("데이터베이스 연결 성공!");
    app.listen(3000, () => console.log("서버 실행 중: http://localhost:3000"));
  })
  .catch((err) => {
    console.error("데이터베이스 연결 실패:", err);
  });
