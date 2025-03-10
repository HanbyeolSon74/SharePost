// postPage.js

window.onload = async function () {
  const postId = window.location.pathname.split("/").pop();

  try {
    const response = await axios.get(`/board/post/${postId}`);

    if (response.status === 200) {
      const post = response.data;

      document.getElementById("postTitle").textContent = post.title;
      document.getElementById("postContent").innerHTML = post.content;
      document.getElementById("postImage").src =
        post.imageUrl || "/images/default.jpg";
    }
  } catch (error) {
    console.error("게시물 로딩 오류:", error);
    alert("게시물 데이터를 가져오는 중 오류가 발생했습니다.");
  }
};
