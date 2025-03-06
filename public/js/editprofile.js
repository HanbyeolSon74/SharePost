// 상세 내용 저장
function syncDetails() {
  document.getElementById("detailsInput").value = detailsEditor.getMarkdown();
}

// 이미지 미리보기
function previewImage(event) {
  const file = event.target.files[0];
  const preview = document.getElementById("preview");

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    preview.style.display = "none";
  }
}

const details = new toastui.Editor({
  el: document.querySelector("#details"),
  previewStyle: "vertical",
  height: "400px",
  initialValue: `<%= product.details %>`, // 기존 상세 내용 미리 표시
});

// 상세 내용 동기화 함수
function syncDetails() {
  // Toast UI Editor에서 작성된 마크다운을 HTML로 변환
  const htmlDetails = details.getHTML(); // 에디터 내용 HTML로 변환
  console.log("변환된 HTML:", htmlDetails); // 변환된 HTML 로그 확인
  document.getElementById("detailsInput").value = htmlDetails; // 변환된 HTML을 hidden input에 저장
}
