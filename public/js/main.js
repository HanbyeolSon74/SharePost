let selectedCategory = "ALL"; // 기본값은 "ALL"
let currentPage = 1;
const limit = 12;
let totalPages = 1; // 서버에서 받아온 전체 페이지 수

window.onload = function () {
  fetchPosts(); // 페이지 로드 시 게시물 불러오기
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
        // 게시물이 없을 때 처리
        const mainPostsBox = document.querySelector(".mainPostsBox");
        // mainPostsBox.innerHTML =
        //   "<div class='noPostsMessage'>게시물이 없습니다.</div>";
        mainPostsBox.innerHTML = "";

        // 게시물이 없을 때 메시지 표시를 위한 새로운 요소 추가
        const noPostsMessage = document.createElement("div");
        noPostsMessage.className = "noPostsMessage";
        noPostsMessage.textContent = "게시물이 없습니다.";

        // 메시지를 부모 요소에 추가
        mainPostsBox.appendChild(noPostsMessage);
        // 페이지네이션 버튼 숨기기
        const pagination = document.querySelector("#pagination");
        pagination.style.display = "none";
      } else {
        renderPosts(posts);
        renderPagination(totalPages);

        // 페이지네이션 버튼 보이기
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

  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.classList.add("post");
    postElement.innerHTML = `
      <div class="postWrap">
        <div class="postItem" onclick="window.location.href='/board/post/view/${post.id}'">
          <img src="${post.mainimage}" alt="${post.title}" />
          <div class="contentHover" style="display:none">${post.content}</div>
        </div>
        <div class="likeHeartWrap" onclick="toggleLike(${post.id})">
          <i class="fa-regular fa-heart" id="heartIcon-${post.id}"></i>
          <span class="likeCount">0</span>
        </div>
        <div class="postTitle" onclick="window.location.href='/board/post/view/${post.id}'"><span>[${post.category.name}]</span> ${post.title}
      </div>
    `;
    mainPostsBox.appendChild(postElement);
  });

  document.querySelectorAll(".postItem").forEach((post) => {
    const contentHover = post.querySelector(".contentHover");
    post.addEventListener("mouseenter", function () {
      contentHover.style.display = "block";
    });
    post.addEventListener("mouseleave", function () {
      contentHover.style.display = "none";
    });
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
  const newState = !isLiked;

  // 좋아요 상태 UI 업데이트
  if (newState) {
    heartIcon.classList.remove("fa-regular");
    heartIcon.classList.add("fa-solid");
    likeCountElement.textContent = parseInt(likeCountElement.textContent) + 1;
  } else {
    heartIcon.classList.remove("fa-solid");
    heartIcon.classList.add("fa-regular");
    likeCountElement.textContent = parseInt(likeCountElement.textContent) - 1;
  }

  try {
    // 서버에 좋아요 상태 전송
    const response = await axios.post(
      `/board/post/${postId}/like`,
      { isLiked: newState },
      { withCredentials: true }
    );
    if (response.status === 200) {
      console.log("좋아요 상태 업데이트 성공");

      const updatedLikes = response.data.likes ?? 0;
      console.log("새로운 좋아요 수:", updatedLikes);

      // 좋아요 수 UI 업데이트
      likeCountElement.textContent = updatedLikes;
    } else {
      console.error("좋아요 상태 업데이트 실패");
    }
  } catch (error) {
    console.error("좋아요 업데이트 에러:", error);
    if (error.response && error.response.status === 403) {
      alert("로그인이 필요한 기능입니다. 로그인 후 다시 시도해주세요.");
    }

    if (newState) {
      heartIcon.classList.remove("fa-solid");
      heartIcon.classList.add("fa-regular");
      likeCountElement.textContent = parseInt(likeCountElement.textContent) - 1;
    } else {
      heartIcon.classList.remove("fa-regular");
      heartIcon.classList.add("fa-solid");
      likeCountElement.textContent = parseInt(likeCountElement.textContent) + 1;
    }
  }
}
