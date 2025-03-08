document
  .getElementById("idFindBtn")
  .addEventListener("click", async function (event) {
    event.preventDefault();
    const phone = document.querySelector("#findPhoneNum").value;
    console.log(phone, "phone??");

    try {
      const response = await axios.post("/user/findid", { phone });
      console.log(response.data); // 응답 내용 출력
      document.getElementById(
        "idResult"
      ).textContent = `찾으시는 아이디는 ${response.data.userId}입니다.`;
    } catch (e) {
      console.error(e); // 에러 출력
      document.getElementById("idResult").textContent =
        "아이디를 찾을 수 없습니다.";
    }
  });

const findPhoneNum = document.querySelector("#findPhoneNum");
const idFindBt = document.querySelector("#idFindBtn");

findPhoneNum.addEventListener("input", function () {
  let phoneValue = findPhoneNum.value;

  phoneValue = phoneValue.replace(/\D/g, "");

  if (phoneValue.length > 11) {
    phoneValue = phoneValue.slice(0, 11);
  }

  findPhoneNum.value = phoneValue;

  if (phoneValue.length === 11) {
    idFindBt.removeAttribute("disabled");
  } else {
    idFindBt.setAttribute("disabled", true);
  }
});
