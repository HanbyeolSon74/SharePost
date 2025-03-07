document.addEventListener("DOMContentLoaded", function () {
  const loginModal = document.getElementById("loginModal");
  const loginBtn = document.querySelector(".loginBtn");
  const closeModal = document.getElementById("closeModal");

  // 모달 열기
  loginBtn.addEventListener("click", function () {
    loginModal.style.display = "flex";
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
    const loginEmail = document.querySelector("#loginEmail").value;
    const loginPassword = document.querySelector("#loginPassword").value;

    const logindata = {
      email: loginEmail,
      password: loginPassword,
    };

    try {
      const response = await axios.post("/user/login", logindata);
      if (response.status === 200) {
        alert("로그인 성공!");
        document.querySelector("#loginModal").style.display = "none";
      }
    } catch (error) {
      alert("로그인 실패!" + (error.response?.data?.message || error.message));
      console.error(error);
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
document
  .getElementById("naver-login-btn")
  .addEventListener("click", function () {
    window.location.href = "http://localhost:3000/user/login/naver";
  });

const params = new URLSearchParams(window.location.search);
const code = params.get("code");
const state = params.get("state");

axios
  .post("http://localhost:3000/user/login/naver/callback", { code, state })
  .then((response) => {
    console.log("네이버 로그인 성공:", response.data);
  })
  .catch((error) => {
    console.error("네이버 로그인 실패:", error);
  });

// 카카오 로그인
Kakao.init(process.env.KAKAO_JS_KEY);
console.log(Kakao.isInitialized());

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
