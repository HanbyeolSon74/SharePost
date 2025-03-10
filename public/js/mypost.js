getMyPosts();
async function getMyPosts() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("로그인이 필요합니다.");
    window.location.href = "/login";
    return;
  }

  try {
    const response = await axios.get("/posts/myposts", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const posts = response.data.posts;
    renderPosts(posts);
  } catch (error) {
    console.error("게시글 불러오기 실패:", error);
    alert("게시글을 불러오는 중 오류가 발생했습니다.");
  }
}

function renderPosts(posts) {
  const postContainer = document.getElementById("postContainer");
  postContainer.innerHTML = "";

  if (posts.length === 0) {
    postContainer.innerHTML = "<p>등록된 게시글이 없습니다.</p>";
    return;
  }

  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.className = "post";
    postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <small>작성일: ${new Date(post.createdAt).toLocaleString()}</small>
        `;
    postContainer.appendChild(postElement);
  });
}
