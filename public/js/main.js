window.onload = function () {
  // 게시물 전체 요청
  axios
    .get("/board/main")
    .then((response) => {
      const posts = response.data.posts;
      console.log(posts);

      const mainPostsBox = document.getElementById("mainPostsBox");
      posts.forEach((post) => {
        const postElement = document.createElement("div");
        postElement.classList.add("post");

        postElement.innerHTML = `
            <div class="contentHover" style="display:none">${data.content}</div>
            <img src="${data.mainimage}" alt="${data.title}" />
            <div>${data.title}</div>
          `;
        // text-overflow: ellipsis; 넘치면 ... 표기 예정
        mainPostsBox.appendChild(postElement);
      });
    })
    .catch((error) => {
      console.error("게시물 불러오기 실패:", error);
    });
};

// <p>카테고리: ${data.category_id}</p>
