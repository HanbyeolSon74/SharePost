document
  .getElementById("idFindBtn")
  .addEventListener("click", async function (event) {
    event.preventDefault();
    console.log("Button clicked");
    const phone = document.querySelector("#findPhoneNum").value;
    console.log(phone, "phone??");
    try {
      const response = await axios.post("/user/findid", { phone });
      document.getElementById(
        "idResult"
      ).textContent = `찾으시는 아이디는 ${response.data.userId}입니다.`;
    } catch (e) {
      document.getElementById("idResult").textContent =
        "아이디를 찾을 수 없습니다.";
    }
  });
