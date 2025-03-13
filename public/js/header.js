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
        postList.innerHTML = "";

        if (!posts || posts.length === 0) {
          document.querySelector(".searchResult").style.display = "none";
          postList.innerHTML =
            "<li class='noPost'>검색된 게시글이 없습니다.</li>";
        } else {
          document.querySelector(".searchResult").style.display = "block";
          posts.forEach((post) => {
            console.log(post, "posts?");
            const li = document.createElement("li");

            const postDetailUrl = `/board/post/view/${post.id}`;

            li.classList.add("listBox");
            li.innerHTML = `
                          <div class="post-image-container">
                ${
                  post.mainimage
                    ? `<img src="${post.mainimage}" alt="${post.title}" class="post-image"/>`
                    : ""
                }
              </div>
              <p class="post-category">[${post.category.name}]</p>
              <h3 class="post-title">${post.title}</h3>
            `;
            li.addEventListener("click", () => {
              window.location.href = postDetailUrl;
            });
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
