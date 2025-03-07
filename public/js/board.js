window.onload = function () {
  const editor = new toastui.Editor({
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

  data.append("title", form["boardPostName"].value);
  data.append("category_id", form["boardType"].value);
  data.append("content", toastEditor.getHTML());

  const fileInput = form["mainBoardImage"];
  const file = fileInput.files[0];

  if (file) {
    data.append("mainBoardImage", file);
  }
  const token = localStorage.getItem("token");

  axios({
    method: "post",
    url: "/board/post",
    data: data,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      console.log(res);
      if (res.status === 200) {
        alert("게시물이 등록되었습니다.");
        window.location.href = "/board/main";
      } else {
        alert("게시물 등록 실패. 다시 시도해주세요.");
      }
    })
    .catch((e) => {
      console.error(e);
      alert("오류가 발생했습니다.");
    });
};
