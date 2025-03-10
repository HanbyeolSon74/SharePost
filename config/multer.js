const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

// 📌 업로드 경로 설정 함수 (폴더가 없으면 자동 생성)
const ensureUploadPath = (uploadPath) => {
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true }); // 폴더 생성
  }
};

// 📌 게시글 이미지 업로드 저장소
const boardImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath =
      process.env.BOARD_IMAGE_STORAGE_PATH || "uploads/boardimages/";
    ensureUploadPath(uploadPath); // 폴더 확인 및 생성
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];

    if (allowedExtensions.includes(fileExtension)) {
      cb(null, Date.now() + fileExtension); // 고유 파일명 설정
    } else {
      cb(new Error("허용되지 않은 파일 확장자입니다."), false);
    }
  },
});

// 📌 프로필 사진 업로드 저장소
const profilePicStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = process.env.IMAGE_STORAGE_PATH || "uploads/profilepics/";
    ensureUploadPath(uploadPath); // 폴더 확인 및 생성
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];

    if (allowedExtensions.includes(fileExtension)) {
      cb(null, Date.now() + fileExtension); // 고유 파일명 설정
    } else {
      cb(new Error("허용되지 않은 파일 확장자입니다."), false);
    }
  },
});

// 📌 파일 확장자 및 MIME 타입 검증 함수 (더 안전하게!)
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const mimeType = fileTypes.test(file.mimetype);
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimeType && extName) {
    cb(null, true);
  } else {
    cb(new Error("이미지 파일만 업로드 가능합니다."), false);
  }
};

// 📌 게시글 이미지 업로드 미들웨어
const uploadBoardImage = multer({
  storage: boardImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 최대 5MB
  fileFilter,
});

// 📌 프로필 사진 업로드 미들웨어
const uploadProfilePic = multer({
  storage: profilePicStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 프로필 사진은 2MB로 제한 (더 가볍게)
  fileFilter,
});

module.exports = { uploadBoardImage, uploadProfilePic };
