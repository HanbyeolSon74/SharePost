document.addEventListener("DOMContentLoaded", async () => {
  const postContainer = document.getElementById("postContainer");

  // 내가 좋아요한 게시물 가져오기
  try {
    const response = await axios.get("/profile/favorites/posts/json");

    // 응답 데이터 구조 확인
    const { success, posts } = response.data;

    if (!success || !posts || posts.length === 0) {
      postContainer.innerHTML = `<p>좋아요한 게시물이 없습니다.</p>`;
      return;
    }

    // 좋아요한 게시물 목록 렌더링
    posts.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.classList.add("post");

      postElement.innerHTML = `
          <div class="post-image">
            <img src="${post.mainimage}" alt="${post.title}" />
          </div>
          <div class="post-content">
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <button class="like-btn" data-post-id="${post.id}">💖 좋아요 취소</button>
          </div>
        `;

      postContainer.appendChild(postElement);
    });

    // 좋아요 취소 버튼 클릭 이벤트
    postContainer.addEventListener("click", async (e) => {
      if (e.target.classList.contains("like-btn")) {
        const postId = e.target.dataset.postId;

        try {
          const response = await axios.post(`/favorites/toggle/${postId}`);
          if (response.data.success) {
            alert("좋아요가 취소되었습니다!");
            postContainer.innerHTML = ""; // 기존 목록 초기화
            getLikedPosts(); // 목록을 다시 불러오기
          } else {
            alert("좋아요 취소 중 오류가 발생했습니다.");
          }
        } catch (error) {
          console.error("좋아요 취소 오류:", error);
          alert("좋아요 취소 중 오류가 발생했습니다.");
        }
      }
    });
  } catch (error) {
    console.error("좋아요 목록 가져오기 실패:", error);
    postContainer.innerHTML = `<p>좋아요 목록을 불러오는 중 오류가 발생했습니다.</p>`;
  }
});

// 좋아요한 게시물 목록 다시 가져오는 함수
async function getLikedPosts() {
  try {
    const response = await axios.get("/favorites/posts/json");
    const { success, posts } = response.data;

    const postContainer = document.getElementById("postContainer");
    postContainer.innerHTML = ""; // 기존 내용 초기화

    if (!success || !posts || posts.length === 0) {
      postContainer.innerHTML = `<p>좋아요한 게시물이 없습니다.</p>`;
      return;
    }

    posts.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.classList.add("post");
      postElement.innerHTML = `
          <div class="post-image">
            <img src="${post.mainimage}" alt="${post.title}" />
          </div>
          <div class="post-content">
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <button class="like-btn" data-post-id="${post.id}">💖 좋아요 취소</button>
          </div>
        `;
      postContainer.appendChild(postElement);
    });
  } catch (error) {
    console.error("좋아요 목록 가져오기 실패:", error);
    document.getElementById(
      "postContainer"
    ).innerHTML = `<p>좋아요 목록을 불러오는 중 오류가 발생했습니다.</p>`;
  }
}
