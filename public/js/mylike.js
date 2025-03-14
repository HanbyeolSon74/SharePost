document.addEventListener("DOMContentLoaded", async () => {
  await getLikedPosts();
});

// 내가 좋아요한 게시물 가져오는 함수
async function getLikedPosts() {
  const postContainer = document.getElementById("postContainer");

  try {
    const response = await axios.get("/profile/favorites/posts/json");
    const { success, posts } = response.data;

    postContainer.innerHTML = ""; // 기존 목록 초기화

    if (!success || !posts || posts.length === 0) {
      postContainer.innerHTML = `<div class="alertText"><p>좋아요한 게시물이 없습니다.</p></div>`;
      return;
    }
    // const categories = [
    //   {
    //     1: "ALL",
    //     2: "JENNIE COLLAB",
    //     3: "NEWJEANS COLLAB",
    //     4: "SINSA",
    //     5: "BIRTH",
    //     6: "PURPOSE",
    //   },
    // ];
    posts.forEach((post) => {
      console.log(post, "post");
      // const categoryName = categories[0][String(post.categoryId)];
      const postElement = document.createElement("div");
      postElement.classList.add("post");
      postElement.className = "postElement";
      postElement.addEventListener("click", () => {
        window.location.href = `/board/post/view/${post.id}`;
      });
      postElement.innerHTML = `
          <div class="post-image">
            <img src="${post.mainimage}" alt="${post.title}" />
          </div>
          <div class="post-header">
            <h3>${post.title}</h3>
            </div>
            <div class="post-content">${post.content}</div>
            <button class="like-btn" data-post-id="${post.id}" data-liked="true">💖 좋아요 취소</button>
          </div>
        `;

      postContainer.appendChild(postElement);
    });

    // 좋아요 버튼 이벤트 리스너 추가
    postContainer.addEventListener("click", handleLikeToggle);
  } catch (error) {
    console.error("좋아요 목록 가져오기 실패:", error);
    postContainer.innerHTML = `<div class="alertText"><p>좋아요 목록을 불러오는 중 오류가 발생했습니다.</p></div>`;
  }
}

// 좋아요 추가/취소 (토글) 함수
async function handleLikeToggle(event) {
  if (!event.target.classList.contains("like-btn")) return;

  const button = event.target;
  const postId = button.dataset.postId;
  const isLiked = button.dataset.liked === "true"; // 현재 상태 확인

  try {
    const response = await axios.post(`/profile/favorites/toggle/${postId}`);
    if (response.data.success) {
      button.dataset.liked = isLiked ? "false" : "true"; // 상태 변경
      button.innerText = isLiked ? "🤍 좋아요" : "💖 좋아요 취소";

      // 좋아요 취소 시 목록에서 제거
      if (isLiked) {
        button.closest(".post").remove();
      }
    } else {
      alert("좋아요 처리 중 오류가 발생했습니다.");
    }
  } catch (error) {
    console.error("좋아요 처리 오류:", error);
    alert("좋아요 처리 중 오류가 발생했습니다.");
  }
}
