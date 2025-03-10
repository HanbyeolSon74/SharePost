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
document
  .getElementById("naver_id_login")
  .addEventListener("click", function () {
    window.location.href = "http://localhost:3000/auth/login/naver/callback";
  });

const params = new URLSearchParams(window.location.search);
const code = params.get("code");
const state = params.get("state");

axios
  .post("http://localhost:3000/auth/login/naver/callback", { code, state })
  .then((response) => {
    console.log("네이버 로그인 성공:", response.data);
  })
  .catch((error) => {
    console.error("네이버 로그인 실패:", error);
  });

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

              // 메인 페이지로 이동 (예: /main 으로 이동)
              window.location.href = "/main";
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
