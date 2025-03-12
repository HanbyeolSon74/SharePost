document.addEventListener("DOMContentLoaded", function () {
  const loginModal = document.getElementById("loginModal");
  const loginBtn = document.querySelector(".loginBtn");
  const closeModal = document.getElementById("closeModal");

  // 쿠키에서 값을 읽는 함수
  function getCookie(name) {
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
    return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
  }

  // 토큰 저장 함수 (HTTPS 여부 확인)
  function saveTokenToCookie(accessToken, refreshToken) {
    const isSecure = window.location.protocol === "https:";
    const cookieOptions = isSecure ? "SameSite=None; Secure" : "SameSite=Lax";

    document.cookie = `accessToken=${accessToken}; path=/; ${cookieOptions}`;
    document.cookie = `refreshToken=${refreshToken}; path=/; ${cookieOptions}`;
  }

  // URL에서 토큰 가져와 저장
  const urlParams = new URLSearchParams(window.location.search);
  const accessTokenFromUrl = urlParams.get("accessToken");
  if (accessTokenFromUrl) {
    saveTokenToCookie(accessTokenFromUrl, "");
    console.log("URL에서 가져온 액세스 토큰 쿠키에 저장:", accessTokenFromUrl);
  }

  // 쿠키에서 액세스 토큰과 리프레시 토큰 확인
  function checkToken() {
    const accessToken = getCookie("accessToken");
    const refreshToken = getCookie("refreshToken");
    console.log("쿠키에서 읽은 액세스 토큰:", accessToken);
    console.log("쿠키에서 읽은 리프레시 토큰:", refreshToken);
    return { accessToken, refreshToken };
  }

  // 로그인 버튼 클릭 시 동작
  loginBtn.addEventListener("click", function () {
    const { accessToken, refreshToken } = checkToken();
    if (accessToken || refreshToken) {
      window.location.href = "/profile/editprofile";
    } else {
      loginModal.style.display = "flex";
    }
  });

  // 모달 닫기
  closeModal.addEventListener("click", function () {
    loginModal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target === loginModal) {
      loginModal.style.display = "none";
    }
  });

  // **로그인 처리**
  document
    .querySelector(".loginBtnModal")
    .addEventListener("click", async function (event) {
      event.preventDefault();

      const loginEmail = document.querySelector("#loginEmail").value.trim();
      const loginPassword = document
        .querySelector("#loginPassword")
        .value.trim();

      if (!loginEmail || !loginPassword) {
        alert("이메일과 비밀번호를 입력하세요.");
        return;
      }

      // 로그인 성공 시 이메일을 로컬 스토리지에 저장
      localStorage.setItem("savedEmail", loginEmail);

      try {
        const response = await axios.post("/auth/login", {
          email: loginEmail,
          password: loginPassword,
        });

        if (response.status === 200 && response.data.accessToken) {
          saveTokenToCookie(
            response.data.accessToken,
            response.data.refreshToken
          );
          alert("로그인 성공!");
          window.location.href = "/profile/editprofile";
        } else {
          alert("로그인 실패: 액세스 토큰이 없습니다.");
        }
      } catch (error) {
        alert(
          "로그인 실패! " + (error.response?.data?.message || error.message)
        );
        console.error("로그인 에러:", error);
      }

      // 페이지가 로드될 때 자동으로 이메일 입력
      const savedEmail = localStorage.getItem("savedEmail");
      if (savedEmail) {
        document.querySelector("#loginEmail").value = savedEmail; // 로컬 스토리지에서 이메일을 가져와 자동 입력
      }
    });

  // 로그아웃 시 로컬 스토리지에서 이메일 삭제
  document
    .querySelector(".deleteSavedEmailBtn")
    .addEventListener("click", function () {
      localStorage.removeItem("savedEmail"); // 로컬 스토리지에서 삭제
    });

  // **네이버 로그인**
  document
    .getElementById("naverIdLogin")
    .addEventListener("click", function () {
      window.location.href = "http://localhost:3000/auth/login/naver";
    });

  // 네이버 로그인 콜백 처리
  const code = urlParams.get("code");
  const state = urlParams.get("state");

  if (code && state) {
    axios
      .post("/auth/login/naver/callback", { code, state })
      .then((response) => {
        if (response.data.accessToken) {
          saveTokenToCookie(response.data.accessToken, "");
          alert(`${response.data.user.name}님, 로그인 성공!`);
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        } else {
          alert("액세스 토큰이 없습니다.");
        }
      })
      .catch((error) => {
        console.error("네이버 로그인 실패:", error);
        alert(
          "네이버 로그인 실패: " +
            (error.response?.data?.message || error.message)
        );
      });
  }

  // **카카오 로그인 SDK 초기화**
  Kakao.init("d81690655f6e24327425d0479d82e55f");

  // 카카오 로그인 버튼 클릭 시 동작
  document
    .getElementById("kakao-login-btn")
    .addEventListener("click", function () {
      Kakao.Auth.login({
        scope: "account_email", // 이메일 권한 요청
        throughTalk: false,
        success: function (authObj) {
          const accessToken = authObj.access_token;
          // 로그인 후 콜백 URL로 리디렉션
          window.location.href = `/auth/kakao/callback?access_token=${accessToken}`;
        },
        fail: function (err) {
          console.error("카카오 로그인 실패:", err);
        },
      });
    });
});

const goToJoinPage = () => {
  window.location.href = "/user/sign";
};

const goToFindIdPage = () => {
  window.location.href = "/user/findid";
};

const goToFindPasswordPage = () => {
  window.location.href = "/user/reset-password";
};
