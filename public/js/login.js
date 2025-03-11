document.addEventListener("DOMContentLoaded", function () {
  const loginModal = document.getElementById("loginModal");
  const loginBtn = document.querySelector(".loginBtn");
  const closeModal = document.getElementById("closeModal");

  // 페이지 로드 후 URL에 토큰이 있는지 확인하고 로컬 스토리지에 저장
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  if (token) {
    // 토큰이 URL에 포함되어 있으면 로컬스토리지에 저장
    localStorage.setItem("token", token);
    console.log("토큰 로컬스토리지에 저장:", token);
  }

  // 네이버 로그인 상태 확인 함수
  function checkNaverLogin(callback) {
    if (typeof naverLogin !== "undefined") {
      naverLogin.getLoginStatus((status) => {
        callback(status && naverLogin.user);
      });
    } else {
      callback(false);
    }
  }

  // 토큰과 리프레시 토큰 가져오는 함수
  function checkToken() {
    const token = localStorage.getItem("token");
    const cookies = document.cookie.split("; ");
    const refreshTokenCookie = cookies.find((cookie) =>
      cookie.startsWith("refreshToken=")
    );
    let refreshToken = null;

    if (refreshTokenCookie) {
      refreshToken = refreshTokenCookie.split("=")[1];
    }

    return { token, refreshToken };
  }

  // 로그인 버튼 클릭 시 동작
  loginBtn.addEventListener("click", function () {
    const { token, refreshToken } = checkToken();

    if (token || refreshToken) {
      // 토큰이 있으면 프로필 수정 페이지로 이동
      window.location.href = "/profile/editprofile";
    } else {
      checkNaverLogin(function (isNaverLoggedIn) {
        if (isNaverLoggedIn) {
          window.location.href = "/profile/editprofile"; // 네이버 로그인 상태일 경우
        } else {
          loginModal.style.display = "flex"; // 로그인 안 되어 있으면 모달창 열기
        }
      });
    }
  });

  // 모달 닫기
  closeModal.addEventListener("click", function () {
    loginModal.style.display = "none";
  });

  // 모달 외부 클릭 시 닫기
  window.addEventListener("click", function (event) {
    if (event.target === loginModal) {
      loginModal.style.display = "none";
    }
  });
});

// axios 로그인
document
  .querySelector(".loginBtnModal")
  .addEventListener("click", async function (event) {
    event.preventDefault();

    const loginEmail = document.querySelector("#loginEmail").value.trim();
    const loginPassword = document.querySelector("#loginPassword").value.trim();

    if (!loginEmail || !loginPassword) {
      alert("이메일과 비밀번호를 입력하세요.");
      return;
    }

    const logindata = { email: loginEmail, password: loginPassword };

    try {
      const response = await axios.post("/auth/login", logindata, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200 && response.data.accessToken) {
        alert("로그인 성공!");

        // JWT 토큰 저장
        localStorage.setItem("token", response.data.accessToken);

        // Authorization 헤더로 토큰 포함하여 서버에 요청
        const token = localStorage.getItem("token");
        console.log("저장된 토큰:", token);
        if (token) {
          const response = await axios.get("/some/protected/api", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log(response.data);
        } else {
          console.log("토큰이 존재하지 않습니다.");
        }

        console.log(userResponse.data); // 서버에서 받은 응답 데이터
        document.querySelector("#loginModal").style.display = "none";
      } else {
        alert("토큰이 없습니다.");
      }
    } catch (error) {
      alert("로그인 실패! " + (error.response?.data?.message || error.message));
      console.error("로그인 에러:", error);
    }
  });

// 네이버 로그인 처리
document.getElementById("naverIdLogin").addEventListener("click", function () {
  window.location.href = "http://localhost:3000/auth/login/naver";
});

// 네이버 로그인 후 콜백 처리
const params = new URLSearchParams(window.location.search);
const code = params.get("code");
const state = params.get("state");

if (code && state) {
  axios
    .post("http://localhost:3000/auth/login/naver/callback", { code, state })
    .then((response) => {
      const { accessToken, user } = response.data;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        console.log("네이버 로그인 후 토큰 저장:", accessToken);
        alert(`${user.name}님, 로그인 성공!`);

        setTimeout(() => {
          window.location.href = "/";
        }, 2000); // 로그인 후 2초 뒤 메인 페이지로 이동
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

// 카카오 로그인
document.getElementById("kakao-login-btn").addEventListener("click", () => {
  Kakao.Auth.login({
    success: function (authObj) {
      Kakao.API.request({
        url: "/v2/user/me",
        success: function (res) {
          const nickname = res.properties.nickname;
          const email = res.kakao_account.email;

          fetch("/user/login/kakao", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              accessToken: authObj.access_token,
              email: email,
              nickname: nickname,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              alert(`${nickname}님 환영합니다!`);
              window.location.href = "/";
            })
            .catch((error) => console.error("Error:", error));
        },
        fail: function (error) {
          console.error("사용자 정보 요청 실패:", error);
        },
      });
    },
    fail: function (err) {
      console.error("로그인 실패:", err);
    },
  });
});
