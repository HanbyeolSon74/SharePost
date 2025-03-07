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
const params = new URLSearchParams(window.location.search);
const code = params.get("code");
const state = params.get("state");

document
  .getElementById("naver-login-btn")
  .addEventListener("click", function () {
    // 환경변수를 가져오기 위한 API 호출
    axios
      .get("/login/naver/")
      .then(function (response) {
        const CLIENT_ID = response.data.CLIENT_ID;
        const REDIRECT_URI = response.data.REDIRECT_URI;
        const STATE = response.data.STATE;

        // 네이버 로그인 URL 생성
        const url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${CLIENT_ID}&state=${STATE}&redirect_uri=${encodeURIComponent(
          REDIRECT_URI
        )}`;

        // 네이버 로그인 페이지로 리디렉션
        window.location.href = "http://localhost:3000/user/login/naver";
      })
      .catch(function (error) {
        console.error("환경변수 로드 실패:", error);
      });
  });
