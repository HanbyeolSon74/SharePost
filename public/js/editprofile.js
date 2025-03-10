document.addEventListener("DOMContentLoaded", function () {
  const loginModal = document.getElementById("loginModal");
  const loginBtn = document.querySelector(".loginBtn");
  const closeModal = document.getElementById("closeModal");

  // 로그인 상태 확인
  const checkLoginStatus = () => {
    const accessToken = localStorage.getItem("token");
    const refreshToken = getCookie("refreshToken"); // 쿠키에서 refreshToken을 가져옴

    if (accessToken) {
      // accessToken이 있으면 내 정보 페이지로 리디렉션
      location.href = "/editprofile"; // 내 정보 수정 페이지
    } else if (refreshToken) {
      // refreshToken이 있으면, 토큰 갱신을 시도
      refreshAccessToken(refreshToken);
    } else {
      // 로그인 상태가 아니라면 로그인 모달을 띄움
      loginModal.style.display = "flex";
    }
  };

  // 로그인 모달 열기
  loginBtn.addEventListener("click", function () {
    checkLoginStatus(); // 로그인 상태 확인
  });

  // 로그인 모달 닫기
  closeModal.addEventListener("click", function () {
    loginModal.style.display = "none";
  });

  // 모달 외부 클릭 시 닫기
  window.addEventListener("click", function (event) {
    if (event.target === loginModal) {
      loginModal.style.display = "none";
    }
  });

  // 쿠키에서 refreshToken을 가져오는 함수
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }

  // refreshToken을 사용하여 accessToken을 갱신하는 함수
  async function refreshAccessToken(refreshToken) {
    try {
      const response = await axios.post("/auth/refresh-token", {
        refreshToken,
      });
      if (response.status === 200 && response.data.accessToken) {
        // 새로운 accessToken 저장
        localStorage.setItem("token", response.data.accessToken);
        alert("토큰이 갱신되었습니다.");
        location.href = "/editprofile"; // 내 정보 수정 페이지로 리디렉션
      } else {
        alert("토큰 갱신 실패");
        loginModal.style.display = "flex"; // 로그인 모달을 띄움
      }
    } catch (error) {
      console.error("토큰 갱신 실패:", error);
      alert("토큰 갱신에 실패했습니다. 다시 로그인 해주세요.");
      loginModal.style.display = "flex"; // 로그인 모달을 띄움
    }
  }

  // 회원 정보 수정 요청
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = new FormData(this);

      const accessToken = localStorage.getItem("token"); // 토큰 가져오기
      if (!accessToken) {
        alert("로그인 후 시도해주세요.");
        location.href = "/login"; // 로그인 페이지로 리디렉션
        return; // 로그인 상태가 아닐 경우 처리
      }

      try {
        const response = await axios.post("/profile/update", formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // 토큰을 Authorization 헤더에 추가
          },
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

  // 회원 탈퇴 확인
  window.confirmDelete = function () {
    if (confirm("정말 회원 탈퇴하시겠습니까?")) {
      const accessToken = localStorage.getItem("token"); // 토큰 가져오기
      if (!accessToken) {
        alert("로그인 후 시도해주세요.");
        location.href = "/login"; // 로그인 페이지로 리디렉션
        return; // 로그인 상태가 아닐 경우 처리
      }

      axios
        .post(
          "/profile/delete",
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // 토큰을 Authorization 헤더에 추가
            },
          }
        )
        .then(() => {
          alert("회원 탈퇴가 완료되었습니다.");
          location.href = "/"; // 메인 페이지로 이동
        })
        .catch((error) => {
          console.error("회원 탈퇴 실패:", error);
          alert("탈퇴 중 오류가 발생했습니다.");
        });
    }
  };
});
