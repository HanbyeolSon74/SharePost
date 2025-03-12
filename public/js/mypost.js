// 쿠키에서 토큰 값을 가져오는 함수
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

async function getMyPosts() {
  const accessToken = getCookie("accessToken");

  if (!accessToken) {
    alert("로그인이 필요합니다.");
    window.location.href = "/login"; // 로그인 페이지로 리디렉션
    return;
  }

  try {
    const response = await axios.get("/profile/myposts", {
      params: {
        token: accessToken,
      },
    });

    // 서버에서 받은 데이터 확인
    console.log("서버에서 받은 게시글 데이터:", response.data.posts);

    const posts = response.data.posts || []; // 데이터가 없으면 빈 배열로 설정

    if (posts.length === 0) {
      alert("등록된 게시글이 없습니다.");
    } else {
      renderPosts(posts); // 응답받은 게시글들을 renderPosts 함수로 전달하여 렌더링
    }
  } catch (error) {
    console.error("게시글 불러오기 실패:", error);
    alert("게시글을 불러오는 중 오류가 발생했습니다.");
  }
}

// 게시글 렌더링 함수
function renderPosts(posts) {
  const postContainer = document.getElementById("postContainer");
  postContainer.innerHTML = ""; // 기존 콘텐츠 초기화

  if (posts.length === 0) {
    postContainer.innerHTML = "<p>등록된 게시글이 없습니다.</p>";
    return;
  }

  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.className = "post";

    // post 객체로 각 항목에 접근하여 렌더링
    postElement.innerHTML = `
      <div class="post-header">
        <h3>${post.title}</h3>
        <small>작성일: ${new Date(post.createdAt).toLocaleString()}</small>
      </div>
      <div class="post-content">${post.content}</div>
      <div class="post-image">
        <img src="${
          post.mainimage || "/uploads/default-image.jpg"
        }" alt="게시글 이미지" />
      </div>
    `;

    postContainer.appendChild(postElement);
  });
}

// 페이지 로딩 후 게시글 불러오기
window.onload = getMyPosts;
