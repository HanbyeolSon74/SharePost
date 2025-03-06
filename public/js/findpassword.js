// 이메일을 입력하고 비밀번호 찾기 버튼 클릭 시 서버로 요청
function findPassword() {
  const email = document.getElementById("email").value;

  // 이메일이 비어있으면 경고
  if (!email) {
    alert("이메일을 입력해 주세요.");
    return;
  }

  // AJAX 요청을 통해 이메일 확인
  fetch("/user/findpassword", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email }), // 이메일을 서버에 전송
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // 이메일이 존재하면 비밀번호 수정 폼을 표시
        const resetForm = document.getElementById("reset-password-form");
        resetForm.style.display = "block";
        document.getElementById("user-email").value = email;
      } else {
        alert("이메일을 찾을 수 없습니다.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("서버 오류가 발생했습니다. 다시 시도해 주세요.");
    });
}

// 비밀번호 수정 요청
document
  .getElementById("reset-password-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // 폼 제출 기본 동작 방지

    const email = document.getElementById("user-email").value;
    const newPassword = document.getElementById("new-password").value;

    // 새 비밀번호가 없으면 경고
    if (!newPassword) {
      alert("새 비밀번호를 입력해 주세요.");
      return;
    }

    // AJAX 요청을 통해 비밀번호 수정
    fetch("/user/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: newPassword }), // 이메일과 새 비밀번호 전송
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert(data.message); // 성공 메시지 출력
          window.location.href = "/login"; // 로그인 페이지로 리다이렉션
        } else {
          alert(data.message); // 실패 메시지 출력
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("서버 오류가 발생했습니다. 다시 시도해 주세요.");
      });
  });
