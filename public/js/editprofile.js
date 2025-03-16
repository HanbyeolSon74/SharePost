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
  let previousImageUrl = imagePreview.getAttribute("data-url");

  // 📌 파일 선택 시 미리보기 업데이트
  profileImageInput.addEventListener("change", function (event) {
    selectedFile = event.target.files[0];

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = function (e) {
        console.log("이미지 로드 성공:", e.target.result);
        imagePreview.style.backgroundImage = `none`;
        imagePreview.style.backgroundImage = `url('${e.target.result}')`;
        imagePreview.setAttribute("data-url", e.target.result);
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
    imagePreview.style.backgroundImage = "url('/images/image.png')";
    imagePreview.removeAttribute("data-url");
    selectedFile = null;
  });

  // 📌 폼 제출 시 이미지 URL도 함께 전송
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const formData = new FormData(this);

    if (selectedFile) {
      formData.append("profileImage", profilePicInput.files[0]);
    } else if (imagePreview.hasAttribute("data-url")) {
      formData.append("profileImageUrl", imagePreview.getAttribute("data-url"));
    }

    // 📌 주소 추가
    formData.append(
      "address",
      document.getElementById("sample6_address").value
    );
    formData.append(
      "detailAddress",
      document.getElementById("sample6_detailAddress").value
    );

    try {
      const response = await axios.post("/profile/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (response.data.success) {
        alert(response.data.message);
        // window.location.reload();

        // ✅ 업로드된 이미지 URL로 미리보기 업데이트
        if (response.data.imageUrl) {
          imagePreview.style.backgroundImage = `url('${response.data.imageUrl}')`;
          imagePreview.setAttribute("data-url", response.data.imageUrl);

          // ✅ 게시글의 프로필 이미지도 즉시 업데이트
          document.querySelectorAll(".post .profile-image").forEach((img) => {
            img.src = response.data.imageUrl;
          });
        }
      }
    } catch (error) {
      console.error("❌ 회원 정보 수정 실패:", error);
      alert("수정 중 오류가 발생했습니다.");
    }
  });

  // 📌 로그아웃 버튼 클릭 이벤트
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      document.cookie = "accessToken=; path=/; max-age=0;";
      document.cookie = "refreshToken=; path=/; max-age=0;";
      alert("로그아웃 되었습니다.");
      window.location.href = "/";
    });
  }

  // 📌 회원 탈퇴 버튼 클릭 이벤트 (프로필 이미지도 삭제)
  if (deleteBtn) {
    deleteBtn.addEventListener("click", function () {
      if (confirm("정말 회원 탈퇴하시겠습니까?")) {
        axios
          .post(
            "/auth/profile/delete",
            { profileImageUrl: previousImageUrl },
            { withCredentials: true }
          )
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

  // 📌 비밀번호 변경 모달 이벤트
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

// 📌 주소 API 연동
function sample6_execDaumPostcode() {
  new daum.Postcode({
    oncomplete: function (data) {
      var addr = ""; // 주소 변수
      var extraAddr = ""; // 참고항목 변수

      //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
      if (data.userSelectedType === "R") {
        // 사용자가 도로명 주소를 선택했을 경우
        addr = data.roadAddress;
      } else {
        // 사용자가 지번 주소를 선택했을 경우(J)
        addr = data.jibunAddress;
      }

      // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
      if (data.userSelectedType === "R") {
        // 법정동명이 있을 경우 추가한다. (법정리는 제외)
        // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
        if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
          extraAddr += data.bname;
        }
        // 건물명이 있고, 공동주택일 경우 추가한다.
        if (data.buildingName !== "" && data.apartment === "Y") {
          extraAddr +=
            extraAddr !== "" ? ", " + data.buildingName : data.buildingName;
        }
        // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
        if (extraAddr !== "") {
          extraAddr = " (" + extraAddr + ")";
        }
        // 조합된 참고항목을 해당 필드에 넣는다.
        document.getElementById("sample6_extraAddress").value = extraAddr;
      } else {
        document.getElementById("sample6_extraAddress").value = "";
      }

      // 우편번호와 주소 정보를 해당 필드에 넣는다.
      document.getElementById("sample6_postcode").value = data.zonecode;
      document.getElementById("sample6_address").value = addr;
      // 커서를 상세주소 필드로 이동한다.
      document.getElementById("sample6_detailAddress").focus();
    },
  }).open();
}
