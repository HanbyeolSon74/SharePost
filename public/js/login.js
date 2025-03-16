document.addEventListener("DOMContentLoaded", function () {
  const loginModal = document.getElementById("loginModal");
  const loginBtn = document.querySelector(".loginBtn");
  const closeModal = document.getElementById("closeModal");
  const saveIdCheckbox = document.querySelector("#saveIdCheckbox");
  const ONE_WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

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

  // 카카오 로그인 상태 확인 함수
  function isKakaoLoggedIn() {
    const accessToken = Kakao.Auth.getAccessToken();
    return accessToken !== null; // 토큰이 존재하면 로그인 상태
  }
  // 로그인 버튼 클릭 시 동작
  loginBtn.addEventListener("click", function () {
    // 카카오 로그인 상태 확인
    if (isKakaoLoggedIn()) {
      // 카카오 로그인 되어 있다면 바로 프로필 페이지로 이동
      window.location.href = "/profile/update";
    } else {
      // 카카오 로그인 안 되어 있다면 모달을 띄움
      const { accessToken, refreshToken } = checkToken();
      if (accessToken || refreshToken) {
        window.location.href = "/profile/update";
      } else {
        loginModal.style.display = "flex";
        const savedEmail = loadEmailFromLocalStorage();
        if (savedEmail) {
          document.querySelector("#loginEmail").value = savedEmail;
          saveIdCheckbox.checked = true;
        } else {
          saveIdCheckbox.checked = false;
        }
      }
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
  // 로컬스토리지에서 이메일 불러오기
  function loadEmailFromLocalStorage() {
    const data = localStorage.getItem("savedEmail");
    if (data) {
      const parsedData = JSON.parse(data);
      const now = new Date().getTime();

      // 일주일이 지나면 삭제
      if (now - parsedData.timestamp > ONE_WEEK_IN_MS) {
        localStorage.removeItem("savedEmail");
        return null;
      }
      return parsedData.email;
    }
    return null;
  }
  // **로그인 처리**
  document
    .querySelector(".loginBtnModal")
    .addEventListener("click", async function (event) {
      event.preventDefault();

      const loginEmail = document.querySelector("#loginEmail").value.trim();
      const loginPassword = document
        .querySelector("#loginPassword")
        .value.trim();

      // '아이디 저장' 체크박스가 선택되었는지 확인
      const saveIdChecked = saveIdCheckbox.checked; // 'saveIdChecked' 변수 정의

      if (!loginEmail || !loginPassword) {
        alert("이메일과 비밀번호를 입력하세요.");
        return;
      }

      // '아이디 저장' 체크박스가 선택되었으면 로컬 스토리지에 저장
      if (saveIdChecked) {
        const now = new Date().getTime();
        const data = { email: loginEmail, timestamp: now };
        localStorage.setItem("savedEmail", JSON.stringify(data));
      }

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
          window.location.href = "/";
        } else {
          alert("로그인 실패: 액세스 토큰이 없습니다.");
        }
      } catch (error) {
        alert(
          "로그인 실패! " + (error.response?.data?.message || error.message)
        );
        console.error("로그인 에러:", error);
      }
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
          const accessToken = Kakao.Auth.getAccessToken();

          console.log(accessToken, "accessToken");
          // 로그인 후 콜백 URL로 리디렉션
          window.location.href = `/auth/kakao/callback?accessToken=${accessToken}`;
        },
        fail: function (err) {
          console.error("카카오 로그인 실패:", err);
        },
      });
    });
});
const goToJoinPage = () => {
  window.location.href = "http://localhost:3000/user/sign";
};

const goToFindIdPage = () => {
  window.location.href = "http://localhost:3000/user/find-id";
};

const goToFindPasswordPage = () => {
  window.location.href = "http://localhost:3000/user/reset-password";
};
