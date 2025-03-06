document.addEventListener("DOMContentLoaded", function () {
  const loginBtn = document.querySelector(".loginBtn"); // 클래스명으로 선택
  const loginModal = document.getElementById("loginModal");
  const closeModal = document.getElementById("closeModal");

  // 로그인 모달을 여는 함수
  function openLoginModal() {
    loginModal.style.display = "block";
    document.getElementById("overLay").style.display = "block";
  }

  // 로그인 모달을 닫는 함수
  function closeLoginModal() {
    loginModal.style.display = "none";
    document.getElementById("overLay").style.display = "none";
  }

  // 오버레이 클릭 시 모달 닫기
  document.getElementById("overLay").addEventListener("click", closeLoginModal);

  // 로그인 모달 닫기 버튼 클릭 시 모달 닫기
  closeModal.addEventListener("click", closeLoginModal);

  // 로그인 버튼 클릭 시 로그인 모달 열기
  loginBtn.addEventListener("click", openLoginModal);

  // 로그인 함수
  function login(event) {
    event.preventDefault(); // 폼 제출 기본 동작 방지

    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value.trim();

    if (!email || !password) {
      alert("이메일과 비밀번호를 입력해 주세요.");
      return;
    }

    try {
      // 로컬스토리지에서 사용자 정보 가져오기
      let users = JSON.parse(localStorage.getItem("users")) || [];

      if (users.length === 0) {
        alert("등록된 사용자가 없습니다.");
        return;
      }

      // 사용자 찾기
      let user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        alert("로그인 성공!");
        localStorage.setItem("userInfo", JSON.stringify(user)); // 로그인한 사용자 정보 저장
        window.location.href = "/logincompleted"; // 홈으로 리디렉션
      } else {
        alert("이메일 또는 비밀번호가 잘못되었습니다.");
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      alert("로그인 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  }

  // 로그인 폼 제출 이벤트 리스너
  document.getElementById("login-form").addEventListener("submit", login);

  // 회원가입 페이지로 이동
  window.goToJoinPage = function () {
    window.location.href = "/user/sign";
  };

  // 아이디 찾기 페이지로 이동
  window.goToFindIdPage = function () {
    window.location.href = "/user/findid";
  };

  // 비밀번호 찾기 페이지로 이동
  window.goToFindPasswordPage = function () {
    window.location.href = "/user/findpassword";
  };
});
