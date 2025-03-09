let selectedCategory = "ALL";
window.onload = function () {
  // 게시물 전체 요청
  fetchPosts();
};
// 게시물 가져오는 함수
function fetchPosts() {
  axios
    .get("/board/main")
    .then((response) => {
      const posts = response.data.posts;
      renderPosts(posts);
      document.querySelectorAll(".allCate").forEach((cateElement, index) => {
        cateElement.addEventListener("click", () => {
          selectedCategory = categories[index].name;
          filterPosts(posts);
        });
      });
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
        <div class="postItem" onclick="window.location.href='/post/${post.id}'">
          <img src="${post.mainimage}" alt="${post.title}" />
          <div class="contentHover" style="display:none">${post.content}</div>
        </div>
        <div class="likeHeartWrap" onclick="toggleLike(${post.id})">
          <i class="fa-regular fa-heart" id="heartIcon-${post.id}"></i>
        </div>
        <div>${post.title}</div>
      </div>
    `;

    mainPostsBox.appendChild(postElement);
  });

  // Hover 효과 추가
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

function filterPosts(posts) {
  const filteredPosts =
    selectedCategory === "ALL"
      ? posts
      : posts.filter((post) => post.category.name === selectedCategory);

  renderPosts(filteredPosts);
}

// 카테고리 박스
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
          <div class="allCate">
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

  const isLiked = heartIcon.classList.contains("fa-solid");
  const newState = !isLiked;

  heartIcon.classList.toggle("fa-regular", newState);
  heartIcon.classList.toggle("fa-solid", !newState);

  try {
    const response = await axios.post(`/post/${postId}/like`, {
      isLiked: newState,
    });
    if (response.status === 200) {
      console.log("좋아요 상태 업데이트 성공");
    } else {
      console.error("좋아요 상태 업데이트 실패");
    }
  } catch (error) {
    console.error("좋아요 업데이트 에러:", error);
  }
}

// 페이지네이션
const pagination = document.querySelector("#pagination");
pagination.innerHTML = `<div class="prev-button firstBtn" onclick="firstPage()">◁</div>
          <div class="prev-button" onclick="prev()">◀◁</div>
          <div class="numberBtnWrap">
            <button class="numberBtn" id="page" onclick="numBtn()">1</button>
          </div>
          <div class="next-button" onclick="next()">▷</div>
          <div class="next-button lastBtn" onclick="lastPage()">▷▶</div>
        </div>`;

let currentPage = 1;
const limit = 9;
let totalPages = 1;
const pagesPerGroup = 3;
