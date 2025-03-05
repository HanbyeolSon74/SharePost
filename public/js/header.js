// 사이드바 열기 버튼 클릭
document.getElementById("searchOpenBtn").addEventListener("click", function () {
  document.getElementById("sideBarContent").classList.add("open"); // 사이드바 열기
  document.getElementById("overLay").classList.add("open"); // 오버레이 활성화
});

// 사이드바 닫기 버튼 클릭
document
  .getElementById("searchCloseBtn")
  .addEventListener("click", function () {
    document.getElementById("sideBarContent").classList.remove("open"); // 사이드바 닫기
    document.getElementById("overLay").classList.remove("open"); // 오버레이 비활성화
  });

// 오버레이 클릭 시 사이드바 닫기
document.getElementById("overLay").addEventListener("click", function () {
  document.getElementById("sideBarContent").classList.remove("open");
  document.getElementById("overLay").classList.remove("open");
});

// hover시 선 없애기
const menuItems = document.querySelectorAll(".menuItem");
const header = document.querySelector(".headerContainer");

menuItems.forEach((item) => {
  item.addEventListener("mouseenter", () => {
    header.style.borderBottom = "1px solid #fff";
  });

  item.addEventListener("mouseleave", () => {
    header.style.borderBottom = "1px solid #000";
  });
});

// 반응형 메뉴 토글 버튼 클릭 시
const menuToggleBtn = document.getElementById("menuToggleBtn");
const menuNav = document.querySelector(".menuNav");

menuToggleBtn.addEventListener("click", () => {
  menuNav.classList.toggle("open");
});
