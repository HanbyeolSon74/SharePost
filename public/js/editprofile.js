document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logoutBtn");
  const profileImageInput = document.getElementById("profilePicInput");
  const imagePreview = document.getElementById("imagePreview");
  const uploadedImageUrlInput = document.getElementById("uploadedImageUrl");
  const uploadBtn = document.querySelector(".uploadBtn");
  const removeBtn = document.querySelector(".removeBtn");
  const form = document.querySelector("form");
  const deleteBtn = document.getElementById("deleteBtn");
  const changePasswordBtn = document.getElementById("changePasswordBtn");
  const changePasswordModal = document.getElementById("changePasswordModal");
  const closeModalBtn = document.getElementById("closeModalBtn");
  let selectedFile = null;

  // 📌 파일 선택 시 미리보기 업데이트
  profilePicInput.addEventListener("change", function (event) {
    selectedFile = event.target.files[0];

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = function (e) {
        console.log("이미지 로드 성공:", e.target.result); // 디버깅 로그 추가
        imagePreview.style.backgroundImage = `none`; // 기존 배경 제거
        imagePreview.style.backgroundImage = `url('${e.target.result}')`;
        imagePreview.setAttribute("data-url", e.target.result); // div에 이미지 URL 저장
      };
      reader.readAsDataURL(selectedFile);
    }
  });

  // 📌 이미지 업로드 버튼 클릭 시 파일 선택창 열기
  uploadBtn.addEventListener("click", function (event) {
    event.preventDefault();
    profilePicInput.click();
  });

  // 📌 이미지 제거 버튼
  removeBtn.addEventListener("click", function (event) {
    event.preventDefault();
    imagePreview.style.backgroundImage = "url('/images/image.png')"; // 기본 이미지로 변경
    imagePreview.removeAttribute("data-url"); // URL 데이터 삭제
    selectedFile = null;
  });

  // 📌 폼 제출 시 이미지 URL도 함께 전송
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const formData = new FormData(this);

    if (selectedFile) {
      formData.append("profileImage", profilePicInput.files[0]); // 이미지 파일 추가
    } else if (imagePreview.hasAttribute("data-url")) {
      formData.append("profileImageUrl", imagePreview.getAttribute("data-url")); // 기존 이미지 URL 추가
    }

    try {
      const response = await axios.post("/profile/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (response.data.success) {
        alert("회원 정보가 수정되었습니다.");

        // ✅ 업로드된 이미지 URL로 미리보기 업데이트
        if (response.data.imageUrl) {
          imagePreview.style.backgroundImage = `url('${response.data.imageUrl}')`;
          imagePreview.setAttribute("data-url", response.data.imageUrl);
        }
      }
    } catch (error) {
      console.error("❌ 회원 정보 수정 실패:", error);
      alert("수정 중 오류가 발생했습니다.");
    }
  });

  // 로그아웃 버튼 클릭 이벤트
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      document.cookie = "accessToken=; path=/; max-age=0;";
      document.cookie = "refreshToken=; path=/; max-age=0;";
      alert("로그아웃 되었습니다.");
      window.location.href = "/";
    });
  }

  // 회원 탈퇴 버튼 클릭 이벤트
  if (deleteBtn) {
    deleteBtn.addEventListener("click", function () {
      if (confirm("정말 회원 탈퇴하시겠습니까?")) {
        axios
          .post("/auth/profile/delete", {}, { withCredentials: true })
          .then(() => {
            alert("회원 탈퇴가 완료되었습니다.");
            location.href = "/";
          })
          .catch((error) => {
            console.error("회원 탈퇴 실패:", error);
            alert("탈퇴 중 오류가 발생했습니다.");
          });
      }
    });
  }

  // 비밀번호 변경 모달 이벤트
  if (changePasswordBtn) {
    changePasswordBtn.addEventListener("click", function () {
      changePasswordModal.style.display = "block";
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", function () {
      changePasswordModal.style.display = "none";
    });
  }

  window.addEventListener("click", function (event) {
    if (event.target === changePasswordModal) {
      changePasswordModal.style.display = "none";
    }
  });
});
