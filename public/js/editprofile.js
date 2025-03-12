document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logoutBtn");
  const profileImage = document.getElementById("profileImage");
  const preview = document.getElementById("preview");
  const form = document.querySelector("form");
  const deleteBtn = document.getElementById("deleteBtn"); // 회원 탈퇴 버튼

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
      document.cookie = "token=; path=/; max-age=0;";
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

      const accessToken = getCookie("token"); // 쿠키에서 토큰 가져오기
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
          .post(
            "/auth/profile/delete",
            {},
            {
              withCredentials: true, // 쿠키를 자동으로 포함시키기 위해
            }
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

  // 쿠키에서 값 가져오기
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }
});
