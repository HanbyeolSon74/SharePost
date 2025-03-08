// 정규식
const emailRegex = /^(?!.*\.\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

// 이메일 확인 요청
async function findPassword() {
  const email = document.getElementById("email").value;

  if (!emailRegex.test(email)) {
    const resultElement = document.getElementById("result");
    resultElement.innerText = "유효한 이메일 주소를 입력해주세요.";
    resultElement.style.color = "red";
    return;
  }

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
      document.getElementById("user-email").value = email;
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

  if (!passwordRegex.test(newPassword)) {
    const pwResult = document.getElementById("pwResult");
    pwResult.innerText =
      "비밀번호는 영문, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다.";
    pwResult.style.color = "red";
    return;
  }

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
