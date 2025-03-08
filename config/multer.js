// config/multer.js
const multer = require("multer");
const path = require("path");
require("dotenv").config();

// 게시글 이미지 업로드 경로
const boardImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 게시글 이미지 경로
    cb(null, process.env.BOARD_IMAGE_STORAGE_PATH || "uploads/boardimages/");
  },
  filename: function (req, file, cb) {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];

    if (allowedExtensions.includes(fileExtension)) {
      cb(null, Date.now() + fileExtension); // 파일 이름을 고유하게 설정
    } else {
      cb(new Error("허용되지 않은 파일 확장자입니다."), false);
    }
  },
});

// 프로필 사진 업로드 경로
const profilePicStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 프로필 사진 경로
    cb(null, process.env.IMAGE_STORAGE_PATH || "uploads/profilepics/");
  },
  filename: function (req, file, cb) {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];

    if (allowedExtensions.includes(fileExtension)) {
      cb(null, Date.now() + fileExtension); // 파일 이름을 고유하게 설정
    } else {
      cb(new Error("허용되지 않은 파일 확장자입니다."), false);
    }
  },
});

// 게시글 이미지를 위한 업로드 미들웨어
const uploadBoardImage = multer({
  storage: boardImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 최대 파일 크기 5MB
  fileFilter: function (req, file, cb) {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    if (mimeType) {
      return cb(null, true);
    } else {
      cb(new Error("이미지 파일만 업로드 가능합니다."), false);
    }
  },
});

// 프로필 사진을 위한 업로드 미들웨어
const uploadProfilePic = multer({
  storage: profilePicStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 최대 파일 크기 5MB
  fileFilter: function (req, file, cb) {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    if (mimeType) {
      return cb(null, true);
    } else {
      cb(new Error("이미지 파일만 업로드 가능합니다."), false);
    }
  },
});

module.exports = { uploadBoardImage, uploadProfilePic };
