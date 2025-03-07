// 비밀번호 찾기 요청
async function findPassword() {
  const email = document.getElementById("email").value;

  try {
    const response = await axios.post("/user/findid", { email });

    if (response.data.success) {
      document.getElementById("result").innerText =
        "새 비밀번호를 설정해주세요.";
      document.getElementById("reset-password-form").style.display = "block";
      document.getElementById("user-email").value = email;
    } else {
      document.getElementById("result").innerText =
        "해당 이메일이 존재하지 않습니다.";
    }
  } catch (error) {
    console.error("비밀번호 찾기 실패:", error);
    document.getElementById("result").innerText = "서버 오류가 발생했습니다.";
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
      window.location.href = "/user/login";
    } else {
      alert("비밀번호 변경에 실패했습니다.");
    }
  } catch (error) {
    console.error("비밀번호 변경 실패:", error);
    alert("서버 오류가 발생했습니다.");
  }
}
