// 정규식
const emailRegex = /^(?!.*\.\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

// 이메일 확인 요청
async function findPassword() {
  const email = document.getElementById("email").value;

  if (!emailRegex.test(email)) {
    const resultElement = document.getElementById("emailResult");
    resultElement.innerText = "유효한 이메일 주소를 입력해주세요.";
    resultElement.style.color = "red";
    return;
  }

  try {
    const response = await axios.post("/user/find-password", { email });

    const resultElement = document.getElementById("emailResult");
    const resetPasswordFormElement = document.getElementById(
      "reset-password-form"
    );
    if (response.data.success) {
      if (resultElement) {
        resultElement.innerText = "새 비밀번호를 설정해주세요.";
      }
      if (resetPasswordFormElement) {
        document.querySelector(".findBoxWrap").style.display = "none";
        resetPasswordFormElement.style.display = "block";
      }
      document.querySelector("#user-email").value = email;
    } else {
      if (resultElement) {
        resultElement.innerText =
          response.data.message || "해당 이메일이 존재하지 않습니다.";
      }
    }
  } catch (error) {
    const resultElement = document.getElementById("emailResult");
    if (error.response && error.response.status === 404) {
      resultElement.innerText = "등록된 이메일이 없습니다.";
    } else if (error.response && error.response.status === 500) {
      resultElement.innerText = "서버 오류가 발생했습니다.";
    } else {
      resultElement.innerText = "알 수 없는 오류가 발생했습니다.";
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

    console.log(response.data.success, "??변경");
    if (response.data.success) {
      alert("비밀번호가 성공적으로 변경되었습니다. 다시 로그인해주세요.");
      window.location.href = "/";
    } else {
      alert("비밀번호 변경에 실패했습니다.");
    }
  } catch (error) {
    console.error("비밀번호 변경 실패:", error);
    if (error.response && error.response.status === 404) {
      console.log("등록된 이메일이 없습니다.");
    } else if (error.response && error.response.status === 500) {
      console.log("서버 오류가 발생했습니다.");
    } else {
      console.log("알 수 없는 오류가 발생했습니다.");
    }
  }
}

// 비밀번호 유효성 검사
const newpwOninput = () => {
  const newPassword = document.getElementById("new-password").value;
  if (!passwordRegex.test(newPassword)) {
    const newpwCheckText = document.querySelector(".newpwCheckText");
    newpwCheckText.innerText =
      "비밀번호는 영문, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다.";
    newpwCheckText.style.color = "red";
  } else {
    const newpwCheckText = document.querySelector(".newpwCheckText");
    newpwCheckText.innerText = "";
  }
};

// 비밀번호 같은지 확인
const pwCheckoninput = () => {
  const newPassword = document.getElementById("new-password").value;
  const newpwCheck = document.getElementById("new-confirm-password").value;
  if (newPassword !== newpwCheck) {
    document.querySelector(".pwSameCheck").innerText =
      "비밀번호가 일치하지 않습니다.";
    document.querySelector(".pwSameCheck").style.color = "red";
  } else if (newpwCheck.length < 1) {
    document.querySelector(".pwSameCheck").innerText = "비밀번호를 입력하세요.";
    document.querySelector(".pwSameCheck").style.color = "red";
  } else {
    document.querySelector(".pwSameCheck").innerText = "";
  }
};
