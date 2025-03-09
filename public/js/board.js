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

  data.append("categoryName", form["boardType"].value);

  const content = toastEditor.getHTML();

  data.append("content", content);

  const fileInput = form["mainBoardImage"];
  const file = fileInput.files[0];

  if (file) {
    data.append("mainBoardImage", file);
  }

  const token = localStorage.getItem("token");
  console.log("토큰:", token);

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
        window.location.href = "/";
      } else {
        alert("게시물 등록 실패. 다시 시도해주세요.");
      }
    })
    .catch((e) => {
      console.error("오류 발생:", e);
      if (e.response) {
        if (e.response.status === 400) {
          console.log(e.response.data.message);
          alert(e.response.data.message);
        } else if (e.response.status === 500) {
          console.log("서버 오류가 발생했습니다.");
          alert("서버 오류가 발생했습니다.");
        } else {
          console.log("알 수 없는 오류가 발생했습니다.");
          alert("알 수 없는 오류가 발생했습니다.");
        }
      } else {
        console.log("서버로부터 응답을 받지 못했습니다.");
        alert("서버로부터 응답을 받지 못했습니다.");
      }
    });
};
