document.addEventListener("DOMContentLoaded", function () {
  // 헤더 검색 기능 추가
  const searchOninput = (event) => {
    const query = event.target.value.trim();

    if (!query) {
      document.getElementById("postList").innerHTML = "";
      document.querySelector(".searchResult").style.display = "none";
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
// 드롭다운
const menuItems = document.querySelectorAll(".menu-item");
const mainOverLay = document.querySelector(".mainOverLay");

menuItems.forEach((menuItem) => {
  const dropdownMenu = menuItem.querySelector(".dropdowns");

  if (dropdownMenu) {
    menuItem.addEventListener("mouseenter", () => {
      mainOverLay.classList.add("open");
      dropdownMenu.style.display = "block";
    });

    menuItem.addEventListener("mouseleave", () => {
      mainOverLay.classList.remove("open");
      dropdownMenu.style.display = "none";
    });
  }
});

// 모달 띄우기
// 쿠키를 설정하는 함수
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // 만료일 설정
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// 쿠키를 가져오는 함수
function getCookie(name) {
  const decodedCookies = decodeURIComponent(document.cookie);
  const cookies = decodedCookies.split(";");
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(name + "=") == 0) {
      return cookie.substring(name.length + 1, cookie.length);
    }
  }
  return "";
}

// 모달과 버튼 요소를 가져옵니다.
const modal = document.querySelector(".event-modal");
const closeButton = document.querySelector(".close-button");
const dismissButton = document.querySelector(".dismiss-button");

// '닫기' 버튼 클릭 시 모달 닫기
closeButton.addEventListener("click", () => {
  modal.style.display = "none"; // 모달을 숨깁니다.
});

// '오늘 그만 보기' 버튼 클릭 시 모달 숨기기 및 쿠키 설정
dismissButton.addEventListener("click", () => {
  modal.style.display = "none"; // 모달을 숨깁니다.

  // 쿠키에 'eventDismissed' 상태를 저장하여 오늘은 더 이상 표시하지 않도록 설정
  setCookie("eventDismissed", "true", 1); // 1일 동안 쿠키 유지
});

// 페이지 로드 시, 쿠키에 'eventDismissed' 값이 있으면 모달을 표시하지 않음
window.addEventListener("load", () => {
  if (getCookie("eventDismissed") === "true") {
    modal.style.display = "none"; // '오늘 그만 보기' 버튼을 눌렀으면 모달을 표시하지 않음
  }
});
