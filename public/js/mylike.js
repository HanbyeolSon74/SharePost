document.addEventListener("DOMContentLoaded", async function () {
  try {
    // 좋아요한 게시물 목록을 서버에서 가져옵니다.
    const response = await axios.get("/profile/favorites/posts");
    const data = response.data;

    console.log("서버 응답:", data); // 서버 응답 출력

    if (data.success && data.posts.length > 0) {
      displayLikedPosts(data.posts);
    } else {
      document.getElementById("postContainer").innerHTML =
        "<p>좋아요한 게시물이 없습니다.</p>";
    }
  } catch (error) {
    console.error("좋아요 게시물 로딩 실패:", error);
    document.getElementById("postContainer").innerHTML =
      "<p>게시물을 불러오는 데 오류가 발생했습니다.</p>";
  }
});

// 좋아요한 게시물 목록을 화면에 표시하는 함수
function displayLikedPosts(posts) {
  const postContainer = document.getElementById("postContainer");
  postContainer.innerHTML = ""; // 기존 내용 초기화

  console.log("받은 게시물들:", posts); // posts 배열 확인

  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.classList.add("post");
    postElement.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.content}</p>
        <img src="${post.mainimage}" alt="${post.title}" width="200">
        <button onclick="toggleLike(${post.id})">좋아요 취소</button>
        <hr>
      `;
    postContainer.appendChild(postElement);
  });
}

// 좋아요 추가/취소 기능
async function toggleLike(postId) {
  try {
    const response = await axios.post(`/favorites/toggle/${postId}`);
    const data = response.data;

    console.log("서버 응답:", data); // 응답 데이터 확인

    if (data.liked) {
      alert("좋아요 추가!");
    } else {
      alert("좋아요 취소!");
    }

    // 화면에 반영할 데이터만 갱신
    const postContainer = document.getElementById("postContainer");
    postContainer.innerHTML = ""; // 기존 내용 초기화

    // 받은 posts 배열을 사용하여 화면 갱신
    data.posts.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.classList.add("post");
      postElement.innerHTML = `
          <h3>${post.title}</h3>
          <p>${post.content}</p>
          <img src="${post.mainimage}" alt="${post.title}" width="200">
          <button onclick="toggleLike(${post.id})">좋아요 취소</button>
          <hr>
        `;
      postContainer.appendChild(postElement);
    });
  } catch (error) {
    console.error("좋아요 처리 실패:", error);
    alert("좋아요 처리 중 오류가 발생했습니다.");
  }
}
