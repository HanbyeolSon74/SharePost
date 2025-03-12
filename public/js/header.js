// 사이드바 열기 버튼 클릭
document.getElementById("searchOpenBtn").addEventListener("click", function () {
  document.getElementById("sideBarContent").classList.add("open");
  document.getElementById("overLay").classList.add("open");
});

// 사이드바 닫기 버튼 클릭
document
  .getElementById("searchCloseBtn")
  .addEventListener("click", function () {
    document.getElementById("sideBarContent").classList.remove("open");
    document.getElementById("overLay").classList.remove("open");
  });

// 오버레이 클릭 시 사이드바 닫기
document.getElementById("overLay").addEventListener("click", function () {
  document.getElementById("sideBarContent").classList.remove("open");
  document.getElementById("overLay").classList.remove("open");
});

// hover시 선 없애기
document.querySelectorAll(".menuItem").forEach((item) => {
  item.addEventListener("mouseenter", () => {
    document.querySelector(".headerContainer").style.borderBottom =
      "1px solid #fff";
  });

  item.addEventListener("mouseleave", () => {
    document.querySelector(".headerContainer").style.borderBottom =
      "1px solid #000";
  });
});

// 반응형 메뉴 토글
const menuToggleBtn = document.getElementById("menuToggleBtn");
const menuNav = document.querySelector(".menuNav");
menuToggleBtn.addEventListener("click", () => {
  menuNav.classList.toggle("open");
});

document.addEventListener("click", function (event) {
  if (
    !menuNav.contains(event.target) &&
    !menuToggleBtn.contains(event.target)
  ) {
    menuNav.classList.remove("open");
  }
});

document.querySelector(".likeBtn").addEventListener("click", function () {
  window.location.href = "/board/favorites";
});

// 헤더 검색 기능 추가
const searchOninput = () => {
  const query = this.value; // 입력된 검색어를 가져옵니다.

  if (query.trim() === "") {
    document.getElementById("postList").innerHTML = ""; // 검색어가 없으면 게시글 목록 비움
    return;
  }

  // 서버에 검색어를 전달하여 게시글을 검색
  axios
    .get(`/board/search?query=${query}`)
    .then((response) => {
      const posts = response.data;

      // 검색된 게시글 목록을 화면에 표시
      const postList = document.getElementById("postList");
      postList.innerHTML = ""; // 기존 게시글 목록을 초기화

      if (posts.length === 0) {
        postList.innerHTML = "<li>검색된 게시글이 없습니다.</li>";
      } else {
        posts.forEach((post) => {
          const li = document.createElement("li");
          li.textContent = post.title;
          const imageContainer = document.createElement("div");
          if (post.mainImage) {
            const image = document.createElement("img");
            image.src = post.mainImage;
            image.alt = post.title;
            image.style.width = "100px";
            imageContainer.appendChild(image);
          }

          li.appendChild(title);
          li.appendChild(category);
          li.appendChild(imageContainer);

          postList.appendChild(li);
        });
      }
    })
    .catch((error) => {
      console.error("게시글 검색 실패:", error);
    });
};
