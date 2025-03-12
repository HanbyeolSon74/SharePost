document.addEventListener("DOMContentLoaded", function () {
  // 헤더 검색 기능 추가
  const searchOninput = (event) => {
    const query = event.target.value.trim();

    if (!query) {
      document.getElementById("postList").innerHTML = "";
      return;
    }

    // 서버에 검색어를 전달하여 게시글 검색
    axios
      .get(`/board/search?searchQuery=${query}`)
      .then((response) => {
        const posts = response.data.posts;
        const postList = document.getElementById("postList");
        postList.innerHTML = ""; // 기존 게시글 목록을 초기화

        if (!posts || posts.length === 0) {
          postList.innerHTML = "<li>검색된 게시글이 없습니다.</li>";
        } else {
          posts.forEach((post) => {
            const li = document.createElement("li");

            // 게시글 제목 추가
            const title = document.createElement("h3");
            title.textContent = post.title;

            // 게시글 카테고리 추가
            const category = document.createElement("p");
            category.textContent = `카테고리: ${post.category.name}`;

            // 게시글 이미지 추가 (이미지가 있다면)
            const imageContainer = document.createElement("div");
            if (post.mainimage) {
              const image = document.createElement("img");
              image.src = post.mainimage;
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

  // 검색어 입력 시 이벤트 리스너 추가
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", searchOninput);
  } else {
    console.error("searchInput 요소를 찾을 수 없습니다.");
  }

  // 사이드바 열기 버튼 클릭
  const searchOpenBtn = document.getElementById("searchOpenBtn");
  if (searchOpenBtn) {
    searchOpenBtn.addEventListener("click", function () {
      document.getElementById("sideBarContent").classList.add("open");
      document.getElementById("overLay").classList.add("open");
    });
  } else {
    console.error("searchOpenBtn 요소를 찾을 수 없습니다.");
  }

  // 사이드바 닫기 버튼 클릭
  const searchCloseBtn = document.getElementById("searchCloseBtn");
  if (searchCloseBtn) {
    searchCloseBtn.addEventListener("click", function () {
      document.getElementById("sideBarContent").classList.remove("open");
      document.getElementById("overLay").classList.remove("open");
    });
  } else {
    console.error("searchCloseBtn 요소를 찾을 수 없습니다.");
  }

  // 오버레이 클릭 시 사이드바 닫기
  const overLay = document.getElementById("overLay");
  if (overLay) {
    overLay.addEventListener("click", function () {
      document.getElementById("sideBarContent").classList.remove("open");
      document.getElementById("overLay").classList.remove("open");
    });
  } else {
    console.error("overLay 요소를 찾을 수 없습니다.");
  }

  // hover 시 선 없애기
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

  if (menuToggleBtn && menuNav) {
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
  } else {
    console.error("menuToggleBtn 또는 menuNav 요소를 찾을 수 없습니다.");
  }

  // 좋아요 버튼 클릭 시 /board/favorites로 이동
  const likeBtn = document.querySelector(".likeBtn");
  if (likeBtn) {
    likeBtn.addEventListener("click", function () {
      window.location.href = "/board/favorites";
    });
  } else {
    console.error("likeBtn 요소를 찾을 수 없습니다.");
  }
});
