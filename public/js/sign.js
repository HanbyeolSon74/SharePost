function toggleCustomDomain() {
  const selectBox = document.getElementById("emailDomainSelect");
  const customDomainInput = document.getElementById("customDomain");

  if (selectBox.value === "직접입력") {
    customDomainInput.disabled = false;
    customDomainInput.focus();
  } else {
    customDomainInput.disabled = true;
    customDomainInput.value = "";
  }
}

// 비밀번호 보기/숨기기 기능
function togglePassword(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);

  if (input.type === "password") {
    input.type = "text";
    icon.textContent = "🙈";
  } else {
    input.type = "password";
    icon.textContent = "👁️";
  }
}

// 카카오 지도 api
function sample6_execDaumPostcode() {
  new daum.Postcode({
    oncomplete: function (data) {
      var addr = "";
      var extraAddr = "";

      if (data.userSelectedType === "R") {
        addr = data.roadAddress;
      } else {
        addr = data.jibunAddress;
      }

      if (data.userSelectedType === "R") {
        if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
          extraAddr += data.bname;
        }

        if (data.buildingName !== "" && data.apartment === "Y") {
          extraAddr +=
            extraAddr !== "" ? ", " + data.buildingName : data.buildingName;
        }

        if (extraAddr !== "") {
          extraAddr = " (" + extraAddr + ")";
        }

        document.getElementById("sample6_extraAddress").value = extraAddr;
      } else {
        document.getElementById("sample6_extraAddress").value = "";
      }

      document.getElementById("sample6_postcode").value = data.zonecode;
      document.getElementById("sample6_address").value = addr;
      document.getElementById("sample6_detailAddress").focus();
    },
  }).open();
}

// 생년월일 select
document.addEventListener("DOMContentLoaded", function () {
  const yearSelect = document.getElementById("birthYear");
  const monthSelect = document.getElementById("birthMonth");
  const daySelect = document.getElementById("birthDay");

  const currentYear = new Date().getFullYear();

  for (let i = currentYear; i >= 1900; i--) {
    let option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    yearSelect.appendChild(option);
  }

  for (let i = 1; i <= 12; i++) {
    let option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    monthSelect.appendChild(option);
  }

  function updateDays() {
    daySelect.innerHTML = '<option value="" disabled selected>일</option>'; // 초기화
    let selectedYear = parseInt(yearSelect.value);
    let selectedMonth = parseInt(monthSelect.value);
    if (!selectedYear || !selectedMonth) return;

    let daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      let option = document.createElement("option");
      option.value = i;
      option.textContent = i;
      daySelect.appendChild(option);
    }
  }

  // 월이 변경될 때마다 일 수 업데이트
  yearSelect.addEventListener("change", updateDays);
  monthSelect.addEventListener("change", updateDays);
});

// 유효성 검사
let emailCheck = false;
let passwordCheck = false;
let confirmPasswordCheck = false;
let nameCheck = false;
let addressCheck = false;
let phoneCheck = false;
let genderCheck = false;
let isChecked = false;
let birthCheck = false;

// 이메일 유효성 검사
const emailOninput = () => {
  const emailInput = document.querySelector("#email");
  const customDomainInput = document.querySelector("#customDomain");
  const emailDomainSelect = document.querySelector("#emailDomainSelect");
  const emailText = document.querySelector(".emailText");

  const emailInputText = emailInput.value.trim();
  const customDomainText = customDomainInput.value.trim();
  const selectedDomain = emailDomainSelect.value;

  let fullEmail = emailInputText;
  if (selectedDomain === "직접입력") {
    fullEmail += "@" + customDomainText;
  } else {
    fullEmail += "@" + selectedDomain;
  }

  const strictEmailRegex =
    /^(?!.*\.\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (emailInputText.length < 1) {
    emailText.innerText = "아이디를 입력하세요.";
    emailText.style.color = "red";
    emailCheck = false;
  } else if (selectedDomain === "직접입력" && customDomainText.length < 1) {
    emailText.innerText = "도메인을 입력하세요.";
    emailText.style.color = "red";
    emailCheck = false;
  } else if (!strictEmailRegex.test(fullEmail)) {
    emailText.innerText = "이메일 형식으로 입력하세요.";
    emailText.style.color = "red";
    emailCheck = false;
  } else {
    emailText.innerText = "";
    emailCheck = true;
  }
  validCheck();
};
// 비밀번호 검사
const passwordOninput = () => {
  const passwordInput = document.querySelector("#password");
  const passwordText = document.querySelector(".passwordText");

  const passwordTextValue = passwordInput.value.trim();
  const passwordRegex =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

  if (passwordTextValue.length < 1) {
    passwordText.innerText = "비밀번호를 입력하세요.";
    passwordText.style.color = "red";
    passwordCheck = false;
  } else if (!passwordRegex.test(passwordTextValue)) {
    passwordText.innerText =
      "영문, 숫자, 특수문자를 포함하여 8자 이상 작성해주세요.";
    passwordText.style.color = "red";
    passwordCheck = false;
  } else {
    passwordText.innerText = "";
    passwordCheck = true;
  }
  validCheck();
};

// 비밀번호 확인
const confirmPasswordOninput = () => {
  const passwordInput = document.querySelector("#password");
  const confirmPasswordInput = document.querySelector("#confirmPassword");
  const confirmPasswordText = document.querySelector(".confirmPasswordText");

  const passwordValue = passwordInput.value.trim();
  const confirmPasswordValue = confirmPasswordInput.value.trim();

  if (confirmPasswordValue.length < 1) {
    confirmPasswordText.innerText = "비밀번호 확인을 입력하세요.";
    confirmPasswordText.style.color = "red";
    confirmPasswordCheck = false;
  } else if (passwordValue !== confirmPasswordValue) {
    confirmPasswordText.innerText = "비밀번호가 일치하지 않습니다.";
    confirmPasswordText.style.color = "red";
    confirmPasswordCheck = false;
  } else {
    confirmPasswordText.innerText = "";
    confirmPasswordCheck = true;
  }
  validCheck();
};

// 이름
const nameOninput = () => {
  const nameInput = document.querySelector("#name");
  const nameText = document.querySelector(".nameText");

  const nameInputText = nameInput.value.trim();

  if (nameInputText.length < 1) {
    nameText.innerText = "이름을 입력하세요.";
    nameText.style.color = "red";
    nameCheck = false;
  } else {
    nameText.innerText = "";
    nameCheck = true;
  }
  validCheck();
};

// 주소 검사
const addressOninput = () => {
  const postcodeInput = document.querySelector("#sample6_postcode");
  const addressInput = document.querySelector("#sample6_address");
  const detailAddressInput = document.querySelector("#sample6_detailAddress");
  const addressText = document.querySelector(".addressText");

  const postcode = postcodeInput.value.trim();
  const address = addressInput.value.trim();
  const detailAddress = detailAddressInput.value.trim();

  if (postcode.length < 1) {
    addressText.innerText = "우편번호를 입력하세요.";
    addressText.style.color = "red";
    addressCheck = false;
  } else if (address.length < 1) {
    addressText.innerText = "주소를 입력하세요.";
    addressText.style.color = "red";
    addressCheck = false;
  } else if (detailAddress.length < 1) {
    addressText.innerText = "상세주소를 입력하세요.";
    addressText.style.color = "red";
    addressCheck = false;
  } else {
    addressText.innerText = "";
    addressCheck = true;
  }
  validCheck();
};

// 휴대폰 번호 검사
const phoneOninput = () => {
  const phonePrefix = document.querySelector("#phonePrefix");
  const phoneMiddle = document.querySelector("#phoneMiddle");
  const phoneLast = document.querySelector("#phoneLast");
  const phoneText = document.querySelector(".phoneText");

  const phoneMiddleValue = phoneMiddle.value.trim();
  const phoneLastValue = phoneLast.value.trim();
  const phoneRegex = /^\d{4}$/;

  if (phonePrefix.selectedIndex === 0 || phonePrefix.value === "") {
    phoneText.innerText = "전화번호 앞자리를 선택하세요.";
    phoneText.style.color = "red";
    phoneCheck = false;
  } else {
    phoneText.innerText = "";
    phoneCheck = true;
  }
  if (!phoneRegex.test(phoneMiddleValue)) {
    phoneText.innerText = "전화번호 중간 4자리를 정확히 입력하세요.";
    phoneText.style.color = "red";
    phoneCheck = false;
  } else {
    phoneText.innerText = "";
    phoneCheck = true;
  }
  if (!phoneRegex.test(phoneLastValue)) {
    phoneText.innerText = "전화번호 마지막 4자리를 정확히 입력하세요.";
    phoneText.style.color = "red";
    phoneCheck = false;
  } else {
    phoneText.innerText = "";
    phoneCheck = true;
  }
  validCheck();
};

// 성별 검사
const genderOninput = () => {
  const genderInputs = document.querySelectorAll('input[name="gender"]');
  const genderText = document.querySelector(".genderText");

  let isChecked = false;
  genderInputs.forEach((input) => {
    if (input.checked) {
      isChecked = true;
    }
  });

  if (!isChecked) {
    genderText.innerText = "성별을 선택하세요.";
    genderText.style.color = "red";
    genderCheck = false;
  } else {
    genderText.innerText = "";
    genderCheck = true;
  }
  validCheck();
};

const birthOninput = () => {
  const birthYear = document.querySelector("#birthYear");
  const birthMonth = document.querySelector("#birthMonth");
  const birthDay = document.querySelector("#birthDay");
  const birthText = document.querySelector(".birthText");

  if (!birthYear.value || !birthMonth.value || !birthDay.value) {
    birthText.innerText = "생년월일을 모두 선택하세요.";
    birthText.style.color = "red";
    birthCheck = false;
  } else {
    birthText.innerText = "";
    birthCheck = true;
  }
  validCheck();
};

// 회원가입 총 유효성 검사
let saveBtn = document.querySelector(".signBtn");
function validCheck() {
  if (
    emailCheck === false &&
    passwordCheck === false &&
    confirmPasswordCheck === false &&
    nameCheck === false &&
    addressCheck === false &&
    phoneCheck === false &&
    genderCheck === false &&
    isChecked === false &&
    birthCheck === false
  ) {
    saveBtn.disabled = false;
  } else {
    saveBtn.disabled = true;
  }
}

// input 초기화
function resetForm() {
  // 텍스트 초기화
  document.querySelector("#email").value = "";
  document.querySelector("#customDomain").value = "";
  document.querySelector("#password").value = "";
  document.querySelector("#confirmPassword").value = "";
  document.querySelector("#name").value = "";
  document.querySelector("#sample6_postcode").value = "";
  document.querySelector("#sample6_address").value = "";
  document.querySelector("#sample6_detailAddress").value = "";
  document.querySelector("#phonePrefix").value = "";
  document.querySelector("#phoneMiddle").value = "";
  document.querySelector("#phoneLast").value = "";

  // 체크 변수 초기화
  emailCheck = false;
  passwordCheck = false;
  confirmPasswordCheck = false;
  nameCheck = false;
  addressCheck = false;
  phoneCheck = false;
  genderCheck = false;
  isChecked = false;
  birthCheck = false;
}

// 회원가입 axios
document.querySelector(".signBtn").addEventListener("click", async function () {
  const userData = {
    name: document.getElementById("name").value,
    phone:
      document.getElementById("phonePrefix").value +
      "-" +
      document.getElementById("phoneMiddle").value +
      "-" +
      document.getElementById("phoneLast").value,
    email:
      document.getElementById("email").value +
      "@" +
      (document.getElementById("emailDomainSelect").value === "직접입력"
        ? document.getElementById("customDomain").value
        : document.getElementById("emailDomainSelect").value),
    password: document.getElementById("password").value,
    address: {
      postcode: document.getElementById("sample6_postcode").value,
      fullAddress: document.getElementById("sample6_address").value,
      detail: document.getElementById("sample6_detailAddress").value,
      extra: document.getElementById("sample6_extraAddress").value,
    },
    gender: document.querySelector('input[name="gender"]:checked')?.value,
    birth_date:
      document.getElementById("birthYear").value +
      "-" +
      document.getElementById("birthMonth").value +
      "-" +
      document.getElementById("birthDay").value,
    age:
      new Date().getFullYear() -
      parseInt(document.getElementById("birthYear").value, 10),
  };

  try {
    const response = await axios.post("/api/users/signup", userData);
    alert("회원가입 성공!");
    console.log(response.data);
  } catch (error) {
    alert("회원가입 실패: " + (error.response?.data?.message || error.message));
    console.error(error);
  }
});

// axios - email 중복 검사
const emailInput = document.querySelector("#email");
const customDomainInput = document.querySelector("#customDomain");
const emailDomainSelect = document.querySelector("#emailDomainSelect");
const emailCheckBtn = document.querySelector(".emailCheckBtn");
const emailText = document.querySelector(".emailText");

// 이메일 주소 생성 함수
function getEmailAddress() {
  const email = emailInput.value.trim();
  const domain =
    emailDomainSelect.value === "직접입력"
      ? customDomainInput.value.trim()
      : emailDomainSelect.value;
  return `${email}@${domain}`;
}

// 이메일 중복 체크 함수
function checkEmail() {
  const emailAddress = getEmailAddress();

  // 이메일 주소가 유효하지 않으면 에러 메시지 출력
  if (!emailAddress.includes("@") || emailAddress.split("@")[0] === "") {
    emailText.innerText = "올바른 이메일 형식이 아닙니다.";
    emailText.style.color = "red";
    return;
  }

  // 이메일 중복 확인 API 요청
  axios
    .get("/user/checkEmail", { params: { email: emailAddress } }) // 수정된 경로 확인
    .then((response) => {
      if (response.data.success) {
        emailText.innerText = "사용 가능한 이메일입니다.";
        emailText.style.color = "green";
      }
    })
    .catch((error) => {
      console.error(error);
      if (error.response && error.response.data) {
        emailText.innerText =
          error.response.data.message || "이메일 중복 확인 오류";
        emailText.style.color = "red";
      } else {
        emailText.innerText = "서버와의 연결 오류입니다.";
        emailText.style.color = "red";
      }
    });
}

// 버튼 클릭 시 이메일 중복 체크 실행
emailCheckBtn.addEventListener("click", checkEmail);
