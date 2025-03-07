// 비밀번호 찾기 요청
async function findPassword() {
  const email = document.getElementById("email").value;

  try {
    const response = await axios.post("/user/find-password", { email });

    const resultElement = document.getElementById("result");
    const resetPasswordFormElement = document.getElementById(
      "reset-password-form"
    );

    if (response.data.success) {
      if (resultElement) {
        resultElement.innerText = "새 비밀번호를 설정해주세요.";
      }
      if (resetPasswordFormElement) {
        resetPasswordFormElement.style.display = "block";
      }
      document.getElementById("user-email").value = email; // 이메일을 입력 폼에 채운다
    } else {
      if (resultElement) {
        resultElement.innerText = "해당 이메일이 존재하지 않습니다.";
      }
    }
  } catch (error) {
    console.error("비밀번호 찾기 실패:", error);
    const resultElement = document.getElementById("result");
    if (resultElement) {
      resultElement.innerText = "서버 오류가 발생했습니다.";
    }
  }
}

// 비밀번호 변경 요청
async function resetPassword() {
  const email = document.getElementById("user-email").value;
  const newPassword = document.getElementById("new-password").value;

  try {
    const response = await axios.post("/user/reset-password", {
      email,
      newPassword,
    });

    if (response.data.success) {
      alert("비밀번호가 성공적으로 변경되었습니다. 다시 로그인해주세요.");
      window.location.href = "/";
    } else {
      alert("비밀번호 변경에 실패했습니다.");
    }
  } catch (error) {
    console.error("비밀번호 변경 실패:", error);
    alert("서버 오류가 발생했습니다.");
  }
}
