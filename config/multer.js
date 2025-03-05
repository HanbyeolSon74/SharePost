const multer = require("multer");
const path = require("path");
const config = require("./config"); // config.js에서 경로 가져오기

// Multer의 디스크 저장소 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.development.imageStoragePath); // .env에서 설정한 경로 사용
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // 고유한 이름으로 저장 (파일 이름 중복 방지)
  },
});

// 파일 업로드 설정
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 최대 파일 크기 5MB
  fileFilter: function (req, file, cb) {
    const fileTypes = /jpeg|jpg|png|gif/; // 허용할 파일 형식
    const mimeType = fileTypes.test(file.mimetype);
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimeType && extName) {
      return cb(null, true); // 파일이 허용된 형식이면 업로드 진행
    } else {
      cb(new Error("이미지 파일만 업로드 가능합니다."), false); // 형식이 맞지 않으면 에러 처리
    }
  },
});

module.exports = upload;
