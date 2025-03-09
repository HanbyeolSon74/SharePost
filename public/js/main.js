let data = [];
window.onload = function () {
  // 게시물 전체 요청
  axios
    .get("/board/main")
    .then((response) => {
      const posts = response.data.posts; // 서버에서 받아온 게시글 목록
      console.log(posts);
      data = response.data.posts;
      const mainPostsBox = document.querySelector(".mainPostsBox"); // 클래스를 선택하는 .mainPostsBox로 변경
      if (!mainPostsBox) {
        console.error("mainPostsBox를 찾을 수 없습니다.");
        return;
      }

      posts.forEach((post) => {
        const postElement = document.createElement("div");
        postElement.classList.add("post");

        // 게시글 콘텐츠와 이미지를 동적으로 추가
        postElement.innerHTML = `
          <div class="contentHover" style="display:none">${post.content}</div>
          <img src="${post.mainimage}" alt="${post.title}" />
          <div>${post.title}</div>
        `;

        // 게시글 요소를 화면에 추가
        mainPostsBox.appendChild(postElement);
      });
    })
    .catch((error) => {
      console.error("게시물 불러오기 실패:", error);
    });
};

// <p>카테고리: ${data.category_id}</p>

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
