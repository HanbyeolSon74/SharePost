document
  .getElementById("idFindBtn")
  .addEventListener("click", async function (event) {
    event.preventDefault();
    const phone = document.querySelector("#findPhoneNum").value; // 전화번호 가져오기
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
