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

// 비밀번호 일치 여부 확인
function checkPasswordMatch() {
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const message = document.querySelector(".passwordMatchText");

  if (confirmPassword === "") {
    message.textContent = "";
  } else if (password === confirmPassword) {
    message.textContent = "✅ 비밀번호가 일치합니다.";
    message.style.color = "green";
  } else {
    message.textContent = "❌ 비밀번호가 일치하지 않습니다.";
    message.style.color = "red";
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

// 숫자 input
document.addEventListener("DOMContentLoaded", function () {
  const phoneMiddle = document.getElementById("phoneMiddle");
  const phoneLast = document.getElementById("phoneLast");

  function allowOnlyNumbers(event) {
    this.value = this.value.replace(/[^0-9]/g, "");
  }

  phoneMiddle.addEventListener("input", allowOnlyNumbers);
  phoneLast.addEventListener("input", allowOnlyNumbers);
});
