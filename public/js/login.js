document.addEventListener("DOMContentLoaded", function () {
  const loginModal = document.getElementById("loginModal");
  const loginBtn = document.querySelector(".loginBtn");
  const closeModal = document.getElementById("closeModal");

  // 모달 열기
  loginBtn.addEventListener("click", function () {
    const token = localStorage.getItem("token");
    if (token) {
      window.location.href = "/editprofile";
    } else {
      loginModal.style.display = "flex";
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
      const response = await axios.post("/user/login", logindata, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("응답 데이터:", response.data); // 응답 데이터 확인
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
// document
//   .getElementById("naver-login-btn")
//   .addEventListener("click", function () {
//     window.location.href = "http://localhost:3000/user/login/naver";
//   });

// const params = new URLSearchParams(window.location.search);
// const code = params.get("code");
// const state = params.get("state");

// axios
//   .post("http://localhost:3000/user/login/naver/callback", { code, state })
//   .then((response) => {
//     console.log("네이버 로그인 성공:", response.data);
//   })
//   .catch((error) => {
//     console.error("네이버 로그인 실패:", error);
//   });

// 카카오 로그인
// Kakao.init(process.env.KAKAO_JS_KEY);
// console.log(Kakao.isInitialized());

function kakaoLogin() {
  Kakao.Auth.login({
    success: function (response) {
      Kakao.API.request({
        url: "/v2/user/me",
        success: function (response) {
          console.log(response);
        },
        fail: function (error) {
          console.log(error);
        },
      });
    },
    fail: function (error) {
      console.log(error);
    },
  });
}
