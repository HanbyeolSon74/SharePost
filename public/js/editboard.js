const editor = new toastui.Editor({
  el: document.querySelector("#toastEditor"),
  height: "400px",
  initialEditType: "wysiwyg",
  previewStyle: "vertical",
});

editor.setHTML("<%= data.content %>");
window.onload = function () {
  const editor = new toastui.Editor({
    el: document.querySelector("#toastEditor"),
    height: "400px",
    initialEditType: "wysiwyg",
    placeholder: "내용을 입력해 주세요.",
    previewStyle: "vertical",
    initialValue: "<%= data.content %>", // 기존 내용 불러오기
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

const editData = (event) => {
  event.preventDefault();

  const form = document.forms["formName"];
  const data = new FormData();

  // 폼 데이터 추가
  data.append("title", form["boardPostName"].value);
  data.append("category_id", form["boardType"].value);
  data.append("content", toastEditor.getHTML());

  const fileInput = form["mainBoardImage"];
  const file = fileInput.files[0];

  if (file) {
    data.append("mainimage", file);
  }

  const postId = form["postId"].value;
  const token = localStorage.getItem("authToken");

  axios({
    method: "post",
    url: `/board/update/${postId}`,
    data: data,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (res.status === 200) {
        alert("게시물이 수정되었습니다.");
        window.location.href = "/board/main"; // 수정 후 게시판 목록 페이지로 이동
      } else {
        alert("게시물 수정 실패. 다시 시도해주세요.");
      }
    })
    .catch((e) => {
      console.error(e);
      alert("오류가 발생했습니다.");
    });
};
