let editor;

document.addEventListener("DOMContentLoaded", function () {
  // 숨겨진 div에서 post.content 값을 가져옵니다.
  let postContent = document.getElementById("postContent").textContent;

  editor = new toastui.Editor({
    el: document.querySelector("#toastEditor"),
    height: "400px",
    initialEditType: "wysiwyg",
    placeholder: "내용을 입력해 주세요.",
    previewStyle: "vertical",
    initialValue: postContent,
  });

  const form = document.forms["formName"];
  if (form) {
    form.addEventListener("submit", function (event) {
      editData(event);
    });
  }
});
const imgpreviewbox = document.getElementById("imgpreviewbox");
const previewImg = document.getElementById("previewImg");
let presrc = previewImg.src;
const imageUrl = presrc;
if (imageUrl) {
  previewImg.src = imageUrl;
  previewImg.style.display = "block";
  imgpreviewbox.innerHTML = `<img id="previewImg" src="${previewImg.src}" />`;
} else {
  previewImg.style.display = "none";
}

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
      imgpreviewbox.innerHTML = `<img id="previewImg" src="${previewImg.src}" />`;
    };

    reader.readAsDataURL(file);
  } else {
    alert("이미지를 선택해주세요.");
  }
}
function getTokenFromCookie() {
  const cookieString = document.cookie;
  const cookies = cookieString.split("; ");
  for (let i = 0; i < cookies.length; i++) {
    const [key, value] = cookies[i].split("=");
    if (key === "authToken") {
      return value;
    }
  }
  return null;
}
const editData = (event) => {
  event.preventDefault();

  const form = document.forms["formName"];
  const data = new FormData();

  // 폼 데이터 추가
  data.append("title", form["boardPostName"].value);
  data.append("category_id", form["boardType"].value);

  // Toast UI Editor에서 HTML 가져오기
  let editorContent = editor.getHTML();

  // 임시 div 요소를 만들어서 content를 설정
  let tempDiv = document.createElement("div");
  tempDiv.innerHTML = editorContent;

  // 불필요한 요소들(예: 툴바, UI 요소 등)을 제거
  let unwantedElements = tempDiv.querySelectorAll(
    ".toastui-editor-defaultUI, .toastui-editor-toolbar, .toastui-editor-popup, .toastui-editor-mode-switch"
  );
  unwantedElements.forEach((element) => element.remove());

  // 이제 정리된 HTML을 FormData에 추가
  data.append("content", tempDiv.innerHTML);

  console.log(form["boardPostName"].value);
  const fileInput = form["mainBoardImage"];
  const file = fileInput.files[0];

  if (file) {
    data.append("mainimage", file);
  }

  const postId = form["postId"].value;

  // FormData 내용 확인
  for (let pair of data.entries()) {
    console.log(pair[0] + ": " + pair[1]); // FormData에서 보내는 데이터 확인
  }
  const token = getTokenFromCookie();

  axios({
    method: "post",
    url: `/board/post/update/${postId}`,
    data: data,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (res.status === 200) {
        alert("게시물이 수정되었습니다.");
        window.location.href = "/";
      } else {
        alert("게시물 수정 실패. 다시 시도해주세요.");
      }
    })
    .catch((e) => {
      console.error(e);
      alert("오류가 발생했습니다.");
    });
};
