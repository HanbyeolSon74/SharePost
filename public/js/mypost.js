// 쿠키에서 토큰 값을 가져오는 함수
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

async function getMyPosts() {
  const token = getCookie("token"); // 쿠키에서 토큰을 가져옴

  if (!token) {
    alert("로그인이 필요합니다.");
    window.location.href = "/login"; // 로그인 페이지로 리디렉션
    return;
  }

  try {
    const response = await axios.get("/profile/myposts", {
      headers: {
        Authorization: `Bearer ${token}`, // Authorization 헤더에 토큰 추가
      },
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

    // 게시글 내용을 HTML로 렌더링 (이스케이프된 HTML을 다시 HTML로 변환)
    postElement.innerHTML = `
      <h3>${post.title}</h3>
      <div class="post-content">${decodeHTML(
        post.content
      )}</div> <!-- HTML 디코딩 후 출력 -->
      <img src="${post.mainimage}" alt="게시글 이미지" />
      <small>작성일: ${new Date(post.createdAt).toLocaleString()}</small>
    `;

    postContainer.appendChild(postElement);
  });
}

// HTML 이스케이프를 디코딩하는 함수
function decodeHTML(str) {
  const element = document.createElement("div");
  element.innerHTML = str;
  return element.textContent || element.innerText || ""; // innerText 또는 textContent 반환
}
