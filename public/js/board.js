// window.onload = function () {
//   const editor = new toastui.Editor({
//     el: document.querySelector("#toastEditor"),
//     height: "400px",
//     initialEditType: "wysiwyg",
//     placeholder: "내용을 입력해 주세요.",
//     previewStyle: "vertical",
//   });
// };

let toastEditor;

window.onload = function () {
  toastEditor = new toastui.Editor({
    el: document.querySelector("#toastEditor"),
    height: "400px",
    initialEditType: "wysiwyg",
    placeholder: "내용을 입력해 주세요.",
    previewStyle: "vertical",
  });
};

document.getElementById("previewImg").style.display = "none";
function imageonChange() {
  const fileInput = document.getElementById("mainBoardImage");
  const file = fileInput.files[0];
  const previewImg = document.getElementById("previewImg");

  if (!file) {
    previewImg.src = "";
    previewImg.style.display = "none";
    return;
  }

  if (file.type.startsWith("image/")) {
    const reader = new FileReader();

    reader.onload = function (event) {
      previewImg.src = event.target.result;
      previewImg.style.display = "block";
    };

    reader.readAsDataURL(file);
  } else {
    alert("이미지를 선택해주세요.");
  }
}

// 폼 전체 데이터 axios
const createData = (event) => {
  event.preventDefault();

  const form = document.forms["formName"];
  const data = new FormData();

  // 데이터 추가
  data.append("title", form["boardPostName"].value);
  // data.append("categoryId", form["boardType"].value);

  // categoryName을 사용해서 보내기
  data.append("categoryName", form["boardType"].value); // categoryId 대신 categoryName 사용

  // 에디터 내용 가져오기 (HTML)
  const content = toastEditor.getHTML();
  console.log("에디터 내용:", content); // 에디터에서 가져온 HTML 확인

  // FormData에 에디터 내용 추가
  data.append("content", content); // 여기서 content를 추가

  const fileInput = form["mainBoardImage"];
  const file = fileInput.files[0];

  if (file) {
    data.append("mainBoardImage", file);
  }

  const token = localStorage.getItem("token"); // 로컬스토리지에서 토큰 가져오기
  console.log("토큰:", token); // 토큰 값 확인

  if (!token) {
    alert("로그인 후 다시 시도해 주세요.");
    return;
  }

  // Axios로 데이터 전송
  axios({
    method: "post",
    url: "/board/post",
    data: data,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`, // Authorization 헤더에 토큰 추가
    },
  })
    .then((res) => {
      console.log("서버 응답:", res);
      if (res.status === 200) {
        alert("게시물이 등록되었습니다.");
        window.location.href = "/board/main"; // 성공 시 게시판으로 이동
      } else {
        alert("게시물 등록 실패. 다시 시도해주세요.");
      }
    })
    .catch((e) => {
      console.error("오류 발생:", e);
      alert("오류가 발생했습니다.");
    });
};
