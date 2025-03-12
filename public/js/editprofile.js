document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logoutBtn");
  const profileImage = document.getElementById("profileImage");
  const preview = document.getElementById("preview");
  const form = document.querySelector("form");
  const deleteBtn = document.getElementById("deleteBtn"); // 회원 탈퇴 버튼
  const changePasswordBtn = document.getElementById("changePasswordBtn");
  const changePasswordModal = document.getElementById("changePasswordModal");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const changePasswordForm = document.getElementById("passwordChangeForm");

  // 프로필 이미지 미리보기 기능
  profileImage.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        preview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // 로그아웃 버튼 클릭 이벤트
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      // 쿠키에서 토큰 삭제
      document.cookie = "accessToken=; path=/; max-age=0;";
      document.cookie = "refreshToken=; path=/; max-age=0;";

      // 로그아웃 완료 메시지 및 페이지 리디렉션
      alert("로그아웃 되었습니다.");
      window.location.href = "/"; // 메인 페이지로 리디렉션
    });
  }

  // 회원 정보 수정 폼 전송
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      // 비밀번호 변경 요청 시 쿠키에서 토큰을 가져오는 부분
      const accessToken = getCookie("accessToken");
      console.log("AccessToken:", accessToken); // 쿠키에서 가져온 토큰 값 출력

      if (!accessToken) {
        alert("로그인 후 시도해주세요.");
        location.href = "/login"; // 로그인 페이지로 리디렉션
        return;
      }

      try {
        const response = await axios.post("/profile/update", formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // 토큰을 Authorization 헤더에 추가
          },
          withCredentials: true, // 쿠키를 자동으로 포함시키기 위해
        });

        if (response.status === 200) {
          alert("회원 정보가 수정되었습니다.");
          location.reload(); // 페이지 새로고침
        }
      } catch (error) {
        console.error("회원 정보 수정 실패:", error);
        alert("수정 중 오류가 발생했습니다.");
      }
    });
  }

  // 회원 탈퇴 버튼 클릭 이벤트
  if (deleteBtn) {
    deleteBtn.addEventListener("click", function () {
      if (confirm("정말 회원 탈퇴하시겠습니까?")) {
        const accessToken = getCookie("accessToken");

        if (!accessToken) {
          alert("로그인 후 시도해주세요.");
          location.href = "/";
          return;
        }

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

  // 쿠키에서 값 가져오기
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }

  // 비밀번호 변경 모달 열기
  if (changePasswordBtn) {
    changePasswordBtn.addEventListener("click", function () {
      changePasswordModal.style.display = "block";
    });
  }

  // 비밀번호 변경 모달 닫기
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", function () {
      changePasswordModal.style.display = "none";
    });
  }

  // 모달 바깥 영역 클릭 시 모달 닫기
  window.addEventListener("click", function (event) {
    if (event.target === changePasswordModal) {
      changePasswordModal.style.display = "none";
    }
  });

  // 비밀번호 변경 처리
  if (changePasswordForm) {
    let newPasswordCheck = false;
    let confirmNewPasswordCheck = false;

    // 비밀번호 유효성 검사
    function validatePassword(input, regex, message) {
      const text = input.nextElementSibling;
      if (input.value.trim().length < 1) {
        text.innerText = message;
        text.style.color = "red";
        return false;
      } else if (!regex.test(input.value.trim())) {
        text.innerText = message;
        text.style.color = "red";
        return false;
      }
      text.innerText = "";
      return true;
    }

    // 새 비밀번호 검사
    const newPasswordOninput = () => {
      newPasswordCheck = validatePassword(
        document.querySelector("#newPassword"),
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
        "영문, 숫자, 특수문자를 포함하여 8자 이상 작성해주세요."
      );
      validCheck();
    };

    // 새 비밀번호 확인 검사
    const confirmNewPasswordOninput = () => {
      const confirmNewPassword = document.querySelector("#confirmNewPassword");
      const confirmNewPasswordText = document.querySelector(
        ".confirmNewPasswordText"
      );

      if (
        confirmNewPassword.value.trim() !==
        document.querySelector("#newPassword").value.trim()
      ) {
        confirmNewPasswordText.innerText = "새 비밀번호가 일치하지 않습니다.";
        confirmNewPasswordText.style.color = "red";
        confirmNewPasswordCheck = false;
      } else {
        confirmNewPasswordText.innerText = "";
        confirmNewPasswordCheck = true;
      }

      validCheck();
    };

    // 유효성 검사
    function validCheck() {
      const passwordChangeBtn = document.querySelector("#passwordChangeBtn");

      if (newPasswordCheck && confirmNewPasswordCheck) {
        passwordChangeBtn.disabled = false;
      } else {
        passwordChangeBtn.disabled = true;
      }
    }

    // 비밀번호 변경 요청
    changePasswordForm.addEventListener("submit", async function (e) {
      e.preventDefault(); // 기본 제출 이벤트 방지

      const userData = {
        newPassword: document.getElementById("newPassword").value,
        confirmNewPassword: document.getElementById("confirmNewPassword").value,
      };

      try {
        const response = await axios.post("/profile/changePassword", userData, {
          withCredentials: true, // 쿠키를 자동으로 포함시키기 위해
        });
        alert("비밀번호 변경 성공!");
        changePasswordModal.style.display = "none"; // 모달 닫기
        window.location.href = "/"; // 비밀번호 변경 후 리다이렉트
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "비밀번호 변경 실패";
        alert(errorMessage);
        console.error(error);
      }
    });

    // 입력 값 변경 시 유효성 검사 호출
    document
      .getElementById("newPassword")
      .addEventListener("input", newPasswordOninput);
    document
      .getElementById("confirmNewPassword")
      .addEventListener("input", confirmNewPasswordOninput);
  }

  // Daum 우편번호 찾기
  function sample6_execDaumPostcode() {
    new daum.Postcode({
      oncomplete: function (data) {
        var addr = "";
        var extraAddr = "";

        if (data.userSelectedType === "R") {
          addr = data.roadAddress;
        } else {
          addr = data.jibunAddress;
        }

        if (data.userSelectedType === "R") {
          if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
            extraAddr += data.bname;
          }
          if (data.buildingName !== "" && data.apartment === "Y") {
            extraAddr +=
              extraAddr !== "" ? ", " + data.buildingName : data.buildingName;
          }
          if (extraAddr !== "") {
            extraAddr = " (" + extraAddr + ")";
          }
          document.getElementById("sample6_extraAddress").value = extraAddr;
        } else {
          document.getElementById("sample6_extraAddress").value = "";
        }

        document.getElementById("sample6_postcode").value = data.zonecode;
        document.getElementById("sample6_address").value = addr;
        document.getElementById("sample6_detailAddress").focus();
      },
    }).open();
  }
});
