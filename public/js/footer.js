// footer.js (예시)
window.onload = function () {
  // 쿠키에서 토큰 가져오기
  const accessToken = getCookie("accessToken");

  if (accessToken) {
    // 토큰이 있으면 백엔드에 요청하여 유효성 검사
    axios
      .get("/api/verify-token", {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true, // 쿠키 포함 요청
      })
      .then((response) => {
        // 토큰이 유효하면 아무런 동작도 하지 않음
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          // 토큰 만료 또는 유효하지 않은 토큰
          document.cookie =
            "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"; // 쿠키에서 토큰 삭제
          alert("로그아웃 되었습니다.");
          window.location.href = "/"; // 로그인 페이지로 리디렉션
        }
      });
  } else {
    // 토큰이 없으면 자동으로 로그인 페이지로 리디렉션
    window.location.href = "/";
  }
};

// 쿠키에서 토큰을 읽어오는 함수
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}
