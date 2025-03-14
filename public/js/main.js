let selectedCategory = "ALL";
let currentPage = 1;
const limit = 12;
let totalPages = 1;

window.onload = function () {
  fetchPosts();
  restoreLikedPosts();
};

function fetchPosts() {
  axios
    .get(
      `/board/main?page=${currentPage}&limit=${limit}&category=${selectedCategory}`
    )
    .then((response) => {
      const posts = response.data.posts;
      totalPages = response.data.totalPages;

      if (posts.length === 0) {
        const mainPostsBox = document.querySelector(".mainPostsBox");
        mainPostsBox.innerHTML = "";

        const noPostsMessage = document.createElement("div");
        noPostsMessage.className = "noPostsMessage";
        noPostsMessage.textContent = "게시물이 없습니다.";
        mainPostsBox.appendChild(noPostsMessage);

        const pagination = document.querySelector("#pagination");
        pagination.style.display = "none";
      } else {
        renderPosts(posts);
        renderPagination(totalPages);

        const pagination = document.querySelector("#pagination");
        pagination.style.display = "flex";
      }
    })
    .catch((error) => {
      console.error("게시물 불러오기 실패:", error);
    });
}

function renderPosts(posts) {
  const mainPostsBox = document.querySelector(".mainPostsBox");
  if (!mainPostsBox) {
    console.error("mainPostsBox를 찾을 수 없습니다.");
    return;
  }
  mainPostsBox.innerHTML = "";
  console.log(posts, "posts???");
  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.classList.add("post");
    postElement.innerHTML = `
      <div class="postWrap">
        <div class="postItem" onclick="window.location.href='/board/post/view/${post.id}'">
          <img src="${post.mainimage}" alt="${post.title}" />
          <div class="contentHover">${post.content}</div>
        </div>
        <div class="likeHeartWrap" onclick="toggleLike(${post.id})">
          <i class="fa-regular fa-heart fa-heart2" id="heartIcon-${post.id}"></i>
          <span class="likeCount">${post.likeCount}</span>
        </div>
        <div class="postTitle" onclick="window.location.href='/board/post/view/${post.id}'"><span>[${post.category.name}]</span> ${post.title}</div>
      </div>
    `;
    mainPostsBox.appendChild(postElement);

    // 서버에서 받은 isLiked 값을 통해 하트 색상 설정
    const heartIcon = document.getElementById(`heartIcon-${post.id}`);
    if (post.isLiked) {
      heartIcon.classList.remove("fa-regular");
      heartIcon.classList.add("fa-solid");
    }
  });

  document.querySelectorAll(".postItem").forEach((post) => {
    const contentHover = post.querySelector(".contentHover");
    post.addEventListener("mouseenter", function () {
      contentHover.classList.add("visible"); // 마우스 오버 시 contentHover가 서서히 나타남
    });
    post.addEventListener("mouseleave", function () {
      contentHover.classList.remove("visible"); // 마우스가 떠날 때 서서히 사라짐
    });
  });

  // 로컬스토리지에서 좋아요 상태 복원
  restoreLikedPosts(posts);
}

function renderPagination(totalPages) {
  const pagination = document.querySelector("#pagination");
  pagination.innerHTML = ` 
    <div class="prev-button firstBtn btnPadding" onclick="firstPage()">처음</div>
    <div class="prev-button btnPadding" onclick="prev()">이전</div>
    <div class="numberBtnWrap btnPadding">
      ${Array.from(
        { length: totalPages },
        (_, i) =>
          `<button class="numberBtn" onclick="goToPage(${i + 1})">${
            i + 1
          }</button>`
      ).join("")}
    </div>
    <div class="next-button btnPadding" onclick="next()">다음</div>
    <div class="next-button lastBtn" onclick="lastPage()">마지막</div>
  `;
}

function goToPage(pageNumber) {
  currentPage = pageNumber;
  fetchPosts();
}

function firstPage() {
  currentPage = 1;
  fetchPosts();
}

function prev() {
  if (currentPage > 1) {
    currentPage--;
    fetchPosts();
  }
}

function next() {
  if (currentPage < totalPages) {
    currentPage++;
    fetchPosts();
  } else {
    alert("더 이상 게시물이 없습니다.");
  }
}

function lastPage() {
  if (currentPage === totalPages) {
    alert("마지막 페이지입니다.");
  } else {
    currentPage = totalPages;
    fetchPosts();
  }
}

// 카테고리 관련 처리
const categoryBox = document.querySelector(".categoryBox");
const categories = [
  { name: "ALL", img: "/images/all_icon.webp" },
  { name: "JENNIE COLLAB", img: "/images/jennie_icon.png" },
  { name: "NEWJEANS COLLAB", img: "/images/nujeans_icon.webp" },
  { name: "SINSA", img: "/images/sinsa_icon.webp" },
  { name: "BIRTH", img: "/images/birth_icon.webp" },
  { name: "PURPOSE", img: "/images/purpost_icon.webp" },
];

categoryBox.innerHTML = `
  <div class="cateAllBox">
    <div class="cateBox">
      ${categories
        .map(
          (category) => `
          <div class="allCate" data-category="${category.name}">
            <div class="cateNameImg">
              <div class="cateImgBox">
                <div class="cateImgCircle"></div>
                <div class="cateImg"><img src="${category.img}" alt="${category.name}"></div>
              </div>
              <div class="cateNameBox"><p>${category.name}</p></div>
            </div>
          </div>
        `
        )
        .join("")}
    </div>
  </div>
`;

// 카테고리 클릭 시 해당 카테고리로 필터링
document.querySelectorAll(".allCate").forEach((cateElement) => {
  cateElement.addEventListener("click", function () {
    selectedCategory = cateElement.dataset.category;

    currentPage = 1;
    fetchPosts();
  });
});

// 게시물 작성 버튼
const postBtnBox = document.querySelector(".postBtnBox");
postBtnBox.innerHTML = `<div class="postBoard">게시물 작성하기</div>`;
const postBoard = document.querySelector(".postBoard");
postBoard.addEventListener("click", function () {
  window.location.href = "/board/post";
});

// 카테고리 호버 효과
const cateImgBoxs = document.querySelectorAll(".cateImgBox");
cateImgBoxs.forEach((box) => {
  const cateImgCircle = box.querySelector(".cateImgCircle");

  box.addEventListener("mouseenter", function () {
    cateImgCircle.style.opacity = "1";
  });

  box.addEventListener("mouseleave", function () {
    cateImgCircle.style.opacity = "0";
  });
});

// 로컬스토리지에서 좋아요 상태 복원
function restoreLikedPosts() {
  const likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || [];
  likedPosts.forEach((postId) => {
    const heartIcon = document.getElementById(`heartIcon-${postId}`);
    if (heartIcon) {
      heartIcon.classList.remove("fa-regular");
      heartIcon.classList.add("fa-solid");
    }
  });
}

// 좋아요 버튼
async function toggleLike(postId) {
  const heartIcon = document.getElementById(`heartIcon-${postId}`);
  const postElement = heartIcon?.closest(".post");
  const likeCountElement = postElement?.querySelector(".likeCount");

  if (!heartIcon || !likeCountElement) {
    console.error("아이콘이나 좋아요 숫자 요소가 선택되지 않았습니다.");
    return;
  }

  const isLiked = heartIcon.classList.contains("fa-solid");

  try {
    const response = await axios.post(
      `/board/post/${postId}/like`,
      {},
      { withCredentials: true }
    );

    if (response.status === 200) {
      const { likes, liked, likeCount } = response.data;

      // 좋아요 상태 UI 업데이트
      if (liked) {
        heartIcon.classList.remove("fa-regular");
        heartIcon.classList.add("fa-solid");
      } else {
        heartIcon.classList.remove("fa-solid");
        heartIcon.classList.add("fa-regular");
      }

      // 좋아요 수 업데이트
      likeCountElement.textContent = likeCount;

      // 로컬스토리지에 좋아요 상태 업데이트
      let likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || [];

      if (liked) {
        // 좋아요 추가
        if (!likedPosts.includes(postId)) {
          likedPosts.push(postId);
        }
      } else {
        // 좋아요 취소
        likedPosts = likedPosts.filter((id) => id !== postId);
      }

      localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
    }
  } catch (error) {
    if (error.response && error.response.status === 403) {
      alert("로그인 후 좋아요가 가능합니다. 로그인을 해주세요.");
      window.location.href = "/";
    } else {
      console.error("좋아요 상태 업데이트 실패:", error);
    }
  }
}

// 모달 띄우기
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
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

const modal = document.querySelector(".event-modal");
const closeButton = document.querySelector(".close-button");
const dismissButton = document.querySelector(".dismiss-button");

closeButton.addEventListener("click", () => {
  modal.style.display = "none"; // 모달 닫기
});

dismissButton.addEventListener("click", () => {
  modal.style.display = "none"; // 모달 닫기

  // 쿠키 설정하여 모달을 다시 보지 않도록 처리
  setCookie("eventDismissed", "true", 1);
});

window.addEventListener("load", () => {
  // 쿠키 값이 "false"일 때만 모달을 보여줌
  if (getCookie("eventDismissed") !== "true") {
    modal.style.display = "flex";
  }
});
window.addEventListener("load", () => {
  if (getCookie("eventDismissed") === "false") {
    modal.style.display = "flex";
  }
});
