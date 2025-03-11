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
  }
  // 네이버 로그인 확인 함수
  function checkNaverLogin(callback) {
    if (typeof naverLogin !== "undefined") {
      naverLogin.getLoginStatus((status) => {
        if (status && naverLogin.user) {
          callback(true);
        } else {
          callback(false);
        }
      });
    } else {
      callback(false);
    }
  }

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
  // 모달 열기
  loginBtn.addEventListener("click", function () {
    const { token, refreshToken } = checkToken();

    if (token || refreshToken) {
      // 토큰이 있으면 프로필 수정 페이지로 이동
      window.location.href = "/profile/editprofile";
    } else {
      checkNaverLogin(function (isNaverLoggedIn) {
        if (isNaverLoggedIn) {
          // 네이버 로그인 상태일 경우
          window.location.href = "/profile/editprofile";
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

        document.querySelector("#loginModal").style.display = "none";
      } else {
        alert("토큰이 없습니다.");
      }
    } catch (error) {
      alert("로그인 실패! " + (error.response?.data?.message || error.message));
      console.error("로그인 에러:", error);
    }
  });

const goToJoinPage = () => {
  window.location.href = "/user/sign";
};

const goToFindIdPage = () => {
  window.location.href = "/user/findid";
};

// 주소 수정 필요
const goToFindPasswordPage = () => {
  window.location.href = "/user/reset-password";
};

// 네이버 로그인 axios
document.getElementById("naverIdLogin").addEventListener("click", function () {
  window.location.href = "http://localhost:3000/auth/login/naver";
});

const params = new URLSearchParams(window.location.search);
const code = params.get("code");
const state = params.get("state");

// 코드와 상태가 있을 경우 서버로 전송하여 액세스 토큰을 받아옴
// 네이버 로그인 후 콜백 처리 (클라이언트)
if (code && state) {
  axios
    .post("http://localhost:3000/auth/login/naver/callback", { code, state })
    .then((response) => {
      const { accessToken, user } = response.data;
      console.log(response);
      console.log("액세스 토큰:", accessToken); // 응답 확인

      if (accessToken) {
        // 액세스 토큰 로컬 스토리지에 저장
        localStorage.setItem("accessToken", accessToken);
        console.log("액세스 토큰 저장:", accessToken); // 디버깅 로그

        // 추가적으로 필요한 데이터도 저장
        localStorage.setItem("loginType", "naver"); // 로그인 타입 저장

        alert(`${user.name}님, 로그인 성공! 메인 페이지로 이동합니다.`);

        setTimeout(() => {
          window.location.href = "/";
        }, 2000); // 2000ms 후에 리다이렉트
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
// main.js

// 카카오 초기화 (복사한 JavaScript 키 넣기)
Kakao.init("KAKAO_JS_KEY");
console.log(Kakao.isInitialized());

fetch("/get-key")
  .then((response) => response.json())
  .then((data) => {
    Kakao.init(data.kakaoKey);
    console.log(Kakao.isInitialized()); // true면 초기화 성공
  })
  .catch((error) => console.error("Error:", error));

// main.js

fetch("/get-key")
  .then((response) => response.json())
  .then((data) => {
    Kakao.init(data.kakaoKey); // 서버로부터 받은 키로 초기화
    console.log(Kakao.isInitialized()); // true면 초기화 성공
  })
  .catch((error) => console.error("Error:", error));

// 로그인 버튼 클릭 이벤트
document.getElementById("kakao-login-btn").addEventListener("click", () => {
  Kakao.Auth.login({
    success: function (authObj) {
      console.log(authObj); // 로그인 성공 정보 출력

      // 사용자 정보 요청
      Kakao.API.request({
        url: "/v2/user/me",
        success: function (res) {
          console.log(res);

          const nickname = res.properties.nickname; // 닉네임 정보
          const email = res.kakao_account.email; // 이메일 정보

          const userInfo = `
                        <p>닉네임: ${nickname}</p>
                        <p>이메일: ${email}</p>
                    `;
          document.getElementById("user-info").innerHTML = userInfo;

          // 서버로 로그인 정보 보내기
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
              console.log(data);

              // 로그인 성공 메시지 표시
              alert(`${nickname}님 환영합니다!`);

              // 메인 페이지로 이동
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

// 네이버 로그아웃 (내 정보에서 가능하게 해야할 듯)
// document.getElementById("logout-btn").addEventListener("click", function () {
//   axios
//     .post("http://localhost:3000/auth/logout") // 백엔드에서 로그아웃 처리
//     .then((response) => {
//       console.log("로그아웃 성공:", response.data);
//       // 로그아웃 후, 로컬 스토리지나 쿠키를 초기화하여 클라이언트에서 로그인 상태 제거
//       localStorage.removeItem("accessToken");
//       // 또는 쿠키에서 토큰을 삭제할 수도 있습니다.
//       document.location.href = "/"; // 홈 페이지로 리디렉션
//     })
//     .catch((error) => {
//       console.error("로그아웃 실패:", error);
//     });
// });

// const logout = async () => {
//   const accessToken = localStorage.getItem("accessToken");

//   try {
//     const response = await axios.post(
//       "https://nid.naver.com/oauth2.0/logout",
//       null,
//       {
//         params: {
//           client_id: process.env.NAVER_CLIENT_ID,
//           client_secret: process.env.NAVER_CLIENT_SECRET,
//           access_token: accessToken,
//         },
//       }
//     );
//     console.log("네이버 로그아웃 성공", response.data);
//   } catch (error) {
//     console.error("네이버 로그아웃 실패:", error);
//   }
// };
