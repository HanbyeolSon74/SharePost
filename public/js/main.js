let selectedCategory = "ALL";
let currentPage = 1;
const limit = 12;
let totalPages = 1;

window.onload = function () {
  fetchPosts();
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
        document.querySelector(".mainPostsBox").innerHTML =
          "<div class='noPostsMessage'>게시물이 없습니다.</div>";
        document.querySelector("#pagination").style.display = "none";
      } else {
        renderPosts(posts);
        renderPagination(totalPages);
        document.querySelector("#pagination").style.display = "flex";
      }
    })
    .catch((error) => {
      console.error("게시물 불러오기 실패:", error);
    });
}

function renderPosts(posts) {
  const mainPostsBox = document.querySelector(".mainPostsBox");
  if (!mainPostsBox) return;

  mainPostsBox.innerHTML = "";

  posts.forEach((post) => {
    console.log(post.isLiked);
    const postElement = document.createElement("div");
    postElement.classList.add("post");
    let heart = post.isLiked
      ? `<i class="fa-heart fa-heart2 fa-solid 
          }" id="heartIcon-${post.id}"></i>`
      : `<i class="fa-heart fa-heart2 fa-regular
          }" id="heartIcon-${post.id}"></i>`;

    postElement.innerHTML = `
      <div class="postWrap">
        <div class="postItem" onclick="window.location.href='/board/post/view/${
          post.id
        }'">
          <img src="${post.mainimage}" alt="${post.title}" />
          <div class="contentHover">${post.content}</div>
        </div>
        <div class="likeHeartWrap" onclick="toggleLike(${post.id})">
          ${heart}
          <span class="likeCount">${post.likes}</span>
        </div>
        <div class="postTitle" onclick="window.location.href='/board/post/view/${
          post.id
        }'">
          <span>[${post.category?.name || "카테고리 없음"}]</span> ${post.title}
        </div>
      </div>
    `;
    mainPostsBox.appendChild(postElement);
  });
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
postBtnBox.innerHTML = `<div class="reviewTitle">BAKERY BOARD</div><div class="postBoard">게시물 작성하기</div>`;
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

// 좋아요 버튼
async function toggleLike(postId) {
  try {
    const response = await axios.post(
      `/board/post/${postId}/like`,
      {},
      { withCredentials: true }
    );

    if (response.status === 200) {
      const { liked, likeCount } = response.data;
      const heartIcon = document.getElementById(`heartIcon-${postId}`);
      const likeCountElement = heartIcon.nextElementSibling;

      heartIcon.classList.toggle("fa-solid", liked);
      heartIcon.classList.toggle("fa-regular", !liked);
      likeCountElement.textContent = likeCount;
    }
  } catch (error) {
    if (error.response && error.response.status === 403) {
      alert("로그인이 필요합니다.");
      window.location.href = "/";
    } else {
      console.error("좋아요 처리 오류:", error);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    }
  }
}

// async function toggleLike(postId) {
//   const heartIcon = document.getElementById(`heartIcon-${postId}`);
//   const likeCountElement = heartIcon.nextElementSibling;

//   if (!heartIcon || !likeCountElement) return;

//   const isCurrentlyLiked = heartIcon.classList.contains("fa-solid");

//   // UI 즉시 변경
//   heartIcon.classList.toggle("fa-solid");
//   heartIcon.classList.toggle("fa-regular");
//   likeCountElement.textContent = isCurrentlyLiked
//     ? parseInt(likeCountElement.textContent) - 1
//     : parseInt(likeCountElement.textContent) + 1;

//   try {
//     const response = await axios.post(
//       `/board/post/${postId}/like`,
//       {},
//       { withCredentials: true }
//     );

//     if (response.status === 200) {
//       const { liked, likeCount } = response.data;

//       // 서버 응답 기반으로 최종 UI 업데이트
//       heartIcon.classList.toggle("fa-solid", liked);
//       heartIcon.classList.toggle("fa-regular", !liked);
//       likeCountElement.textContent = likeCount;
//     }
//   } catch (error) {
//     console.error("좋아요 상태 업데이트 실패:", error);
//     alert("좋아요 처리 중 오류가 발생했습니다.");
//   }
// }

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
