document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logoutBtn");
  const profileImage = document.getElementById("profileImage");
  const preview = document.getElementById("preview");
  const form = document.querySelector("form");
  const deleteBtn = document.getElementById("deleteBtn"); // 회원 탈퇴 버튼

  // 프로필 이미지 미리보기 기능
  profileImage.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        preview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // 로그아웃 버튼 클릭 이벤트
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      // 쿠키에서 토큰 삭제
      document.cookie = "accessToken=; path=/; max-age=0;";
      document.cookie = "refreshToken=; path=/; max-age=0;";

      // 로그아웃 완료 메시지 및 페이지 리디렉션
      alert("로그아웃 되었습니다.");
      window.location.href = "/"; // 메인 페이지로 리디렉션
    });
  }

  // 회원 정보 수정 폼 전송
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = new FormData(this);

      const accessToken = getCookie("token"); // 쿠키에서 토큰 가져오기
      if (!accessToken) {
        alert("로그인 후 시도해주세요.");
        location.href = "/login"; // 로그인 페이지로 리디렉션
        return;
      }

      try {
        const response = await axios.post("/profile/update", formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // 토큰을 Authorization 헤더에 추가
          },
          withCredentials: true, // 쿠키를 자동으로 포함시키기 위해
        });

        if (response.status === 200) {
          alert("회원 정보가 수정되었습니다.");
          location.reload(); // 페이지 새로고침
        }
      } catch (error) {
        console.error("회원 정보 수정 실패:", error);
        alert("수정 중 오류가 발생했습니다.");
      }
    });
  }

  // 회원 탈퇴 버튼 클릭 이벤트
  if (deleteBtn) {
    deleteBtn.addEventListener("click", function () {
      if (confirm("정말 회원 탈퇴하시겠습니까?")) {
        const accessToken = getCookie("accessToken");
        if (!accessToken) {
          alert("로그인 후 시도해주세요.");
          location.href = "/";
          return;
        }

        axios
          .post(
            "/auth/profile/delete",
            {},
            {
              withCredentials: true, // 쿠키를 자동으로 포함시키기 위해
            }
          )
          .then(() => {
            alert("회원 탈퇴가 완료되었습니다.");
            location.href = "/";
          })
          .catch((error) => {
            console.error("회원 탈퇴 실패:", error);
            alert("탈퇴 중 오류가 발생했습니다.");
          });
      }
    });
  }

  // 쿠키에서 값 가져오기
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }
});

function sample6_execDaumPostcode() {
  new daum.Postcode({
    oncomplete: function (data) {
      // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

      // 각 주소의 노출 규칙에 따라 주소를 조합한다.
      // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
      var addr = ""; // 주소 변수
      var extraAddr = ""; // 참고항목 변수

      //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
      if (data.userSelectedType === "R") {
        // 사용자가 도로명 주소를 선택했을 경우
        addr = data.roadAddress;
      } else {
        // 사용자가 지번 주소를 선택했을 경우(J)
        addr = data.jibunAddress;
      }

      // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
      if (data.userSelectedType === "R") {
        // 법정동명이 있을 경우 추가한다. (법정리는 제외)
        // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
        if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
          extraAddr += data.bname;
        }
        // 건물명이 있고, 공동주택일 경우 추가한다.
        if (data.buildingName !== "" && data.apartment === "Y") {
          extraAddr +=
            extraAddr !== "" ? ", " + data.buildingName : data.buildingName;
        }
        // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
        if (extraAddr !== "") {
          extraAddr = " (" + extraAddr + ")";
        }
        // 조합된 참고항목을 해당 필드에 넣는다.
        document.getElementById("sample6_extraAddress").value = extraAddr;
      } else {
        document.getElementById("sample6_extraAddress").value = "";
      }

      // 우편번호와 주소 정보를 해당 필드에 넣는다.
      document.getElementById("sample6_postcode").value = data.zonecode;
      document.getElementById("sample6_address").value = addr;
      // 커서를 상세주소 필드로 이동한다.
      document.getElementById("sample6_detailAddress").focus();
    },
  }).open();
}
