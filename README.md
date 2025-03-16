# 🥐 BAKEZY
[db.drawio.pdf](https://github.com/user-attachments/files/19273195/db.drawio.pdf)
**빵을 리뷰하고 공유하는 플랫폼**  

## 🚀 프로젝트 소개  
**BAKEZY**는 **MVC 패턴과 MySQL**을 활용하여 개발한 쇼핑몰 관리자 시스템입니다.  
빵들의 솔직한 후기를 공유하는 웹사이트입니다. 
사용자는 직접 빵을 평가하고 사진과 함께 후기를 남길 수 있으며, 인기 있는 빵을 추천받을 수도 있습니다.

## 🎯 개발 동기  
빵과 감각적인 디자인을 좋아하는 사람들이 보다 쉽게 정보를 공유할 수 있도록 이 플랫폼을 기획했습니다. 
단순한 후기 사이트가 아니라, 사용자들의 실제 경험과 의견을 반영하여 빵을 보다 깊이 있게 탐색할 수 있는 공간을 목표로 하고 있습니다.

## DB 설계도
<img width="789" alt="Image" src="https://github.com/user-attachments/assets/8311c724-3816-4e56-9227-80118084950b" />

## 🖥️ 주요 기능  
✔ **빵 후기 작성**  
- 빵에 대한 맛, 식감, 향 등에 대한 리뷰 작성 가능
- 사진 업로드

✔ **빵 검색 및 추천**  
- 빵 검색 가능
- 인기 빵 및 트렌드 리뷰 제공 

✔ **소셜 로그인 및 좋아요 기능**  
- 카카오, 네이버 등 소셜 로그인 지원
- 좋아요를 눌러 인기 있는 리뷰 확인

✔ **데이터베이스 연동**  
- MySQL을 활용하여 게시글 저장 및 관리  
- 유저 정보 저장 및 관리

## ⚙️ 기술 스택  
- **Frontend**: HTML, CSS, EJS  
- **Backend**: Node.js, Express  
- **Database**: MySQL  
- **Architecture**: MVC 패턴 , JWT, OAuth (Kakao, Naver) 

## 📌 향후 계획  
- 평점 기능 추가  
- 댓글 기능 추가  


## 로그인 페이지 ##
- 로그인 모달창이 보이는 페이지 (아이디 찾기, 비밀번호 찾기, 카카오 & 네이버 로그인도 가능)
![Image](https://github.com/user-attachments/assets/b8bced74-cf95-4f05-8365-98085484fa7f)

## 회원가입 페이지 ##
- 회원가입 페이지 (비밀번호 2차 확인,  조건 모두 만족해야 버튼 활성화)
![Image](https://github.com/user-attachments/assets/c9303cb8-e648-44a8-b769-cd14f4063926)
  
## 내정보수정 페이지 ##
- 내정보수정 페이지 (프로필 이미지 변경, 주소 API, 비밀번호 변경)
![Image](https://github.com/user-attachments/assets/f3ff7709-29a8-433f-823e-8c2b8bfb8983)

## 게시글 작성 페이지 ##
- 게시글 작성 페이지 (메인 이미지, 내용 이미지 추가 가능)
![Image](https://github.com/user-attachments/assets/0cb103d7-eade-47d9-addd-32614e36cfb5)
  
## 게시글 수정 페이지 ##
- 게시글 수정 페이지
![Image](https://github.com/user-attachments/assets/67d9689f-2951-4497-beb4-20688061aa58)

## 상세 게시글 페이지 ##
- 상세 게시글 페이지 (본인 작성 게시글 삭제 & 수정)
![Image](https://github.com/user-attachments/assets/9d4f60da-1691-450d-a94f-caf5ce5664f4)
  
## 좋아요 페이지 ##
- 좋아요 게시판이 보이는 페이지
![Image](https://github.com/user-attachments/assets/d6c53bac-4b7a-4aa5-8cc0-12d5539bf306)

## 카테고리 페이지 ##
- 선택한 카테고리 게시글이 보이는 페이지
![Image](https://github.com/user-attachments/assets/9358bc33-655a-43e8-a8dd-224b8c2431ef)
  
## 게시글 검색 페이지 ##
- 검색한 게시글 보이는 페이지
![Image](https://github.com/user-attachments/assets/1dc773b3-91ef-4c92-9816-e2f4455d92ad)

- ## 메인 페이지 ##
전체 게시판이 보이는 페이지 (페이지 네이션)
![Image](https://github.com/user-attachments/assets/e6c05e7c-dcde-4c76-9637-1a279b3c733f)

## 메인 페이지 (반응형 : 전 페이지 반응형) ##
- 전체 게시판이 보이는 페이지 1
![Image](https://github.com/user-attachments/assets/bf8be14a-5557-4776-86c1-35991f38b426)
- 전체 게시판이 보이는 페이지 2 (아이폰 SE 사이즈)

