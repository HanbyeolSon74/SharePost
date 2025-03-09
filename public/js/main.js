window.onload = function () {
  // 게시물 전체 요청
  axios
    .get("/board/main")
    .then((response) => {
      const posts = response.data.posts; // 서버에서 받아온 게시글 목록
      console.log(posts);

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
