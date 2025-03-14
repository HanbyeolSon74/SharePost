window.onload = async function () {
  document.querySelector(".contentWrapBox").innerHTML = `
  <div class="postContentAllWrap">
  <div class="btnsWrap">
  
  <div class="fixBtn" data-post-id="<%= post.id %>" data-post-user-id="<%= post.userId %>"
  >수정</div>
  <div class="deleteBtn">삭제</div>
  </div>
    <div class="postDetailWrap">
      <div class="postTitleUserWrap">
        <div class="titleWrap">
          <h1 id="postTitle"></h1>
        </div>
        <div class="postTitleBottom">
        <div class="userIdDateWrap">
        <div class="userLeft">
          <div class="userImageWrap">
            <img
              src="/uploads/profilepics/profile.png"
              alt="userImage"
              class="userImage"
            />
          </div>
          <div class="idDateWrap">
            <div class="userId"></div>
            <div class="firstPostDate"></div>
            <div class="postDate"></div>
          </div>
          </div>
          
          <div class="postlikeBtn"></div>
          </div>
        </div>
      </div>
      <div class="mainContentWrap">
      <div class="postMainImgWrap">
        <img id="postMainImage" alt="PostMainImage" /></div>
        <div id="postContent"></div>
      </div>
      <div class="postBottomWrap">
        <div class="bakezyLogoWrap">
          <span class="bottomLine"></span>
          <a href="/">
            <img
              src="/images/all_icon.webp"
              alt="bakezyLogo"
              class="bakezyLogoImg"
            />
          </a>
          <span class="bottomLine"></span>
        </div>
        <a href="/"><div class="bakezyName">BAKEZY</div><a>
        <div class="bakezyex">세상의 모든 빵집 후기</div>
        <a href="/"><div class="mainPageGo">다른 게시물 보기</div><a>
      </div>
    </div>
    <div class="bottomBtnsWrap">
      <div class="sharePostBtn">📢 신고</div>
      <div class="reportPostBtn" id="download-pdf">📂 공유</div>
      <div class="topBtn">△ top</div>
    </div>
  </div>`;

  const postId = window.location.pathname.split("/").pop();

  function formatDate(dateString) {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", options);
  }

  function restoreLikedPosts(likeCount) {
    const likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || [];
    const heartIcon = document.getElementById(`heartIcon-${postId}`);
    const likeCountElement = document.querySelector(".detailLikeCount");

    if (heartIcon && likeCountElement) {
      const isLiked = likedPosts.includes(postId);
      heartIcon.classList.toggle("fa-solid", isLiked);
      heartIcon.classList.toggle("fa-regular", !isLiked);
      likeCountElement.textContent = likeCount;
    }
  }

  try {
    const response = await axios.get(`/board/post/${postId}`);

    if (response.status === 200) {
      console.log(response.data, "??전체");
      const { post, canEdit, likes, liked, likeCount } = response.data;

      document.getElementById("postTitle").textContent = post.title;
      document.querySelector(".userId").textContent = post.user.name;
      document.querySelector(
        ".firstPostDate"
      ).textContent = `작성일 : ${formatDate(post.createdAt)}`;
      document.querySelector(".postDate").textContent = `수정일 : ${formatDate(
        post.updatedAt
      )}`;

      document.querySelector(".postlikeBtn").innerHTML = `
        <i class="fa-solid fa-print print-icon"></i>
        <div class="likeCircle">
          <i class="fa-${
            liked ? "solid" : "regular"
          } fa-heart fa-heart2" id="heartIcon-${post.id}" onclick="toggleLike(${
        post.id
      })"></i>
          <span class="detailLikeCount">${likeCount}</span>
        </div>`;
      restoreLikedPosts(likeCount);

      const printIcon = document.querySelector(".print-icon");
      if (printIcon) {
        printIcon.addEventListener("click", function () {
          window.print(); // 인쇄 대화상자 열기
        });
      } else {
        console.log("프린트 아이콘을 찾을 수 없습니다.");
      }
      document.getElementById("postContent").innerHTML = `${post.content}`;
      document.getElementById("postMainImage").src =
        post.mainimage || "/images/default.jpg";

      if (window.FontAwesome) {
        window.FontAwesome.dom.i2svg();
      }
      const fixBtn = document.querySelector(".fixBtn");
      const deleteBtn = document.querySelector(".deleteBtn");

      if (canEdit) {
        fixBtn.classList.add("show");
        deleteBtn.classList.add("show");
      } else {
        fixBtn.classList.remove("show");
        deleteBtn.classList.remove("show");
      }
    }
  } catch (error) {
    console.error("게시물 로딩 오류:", error);
    alert("게시물 데이터를 가져오는 중 오류가 발생했습니다.");
  }

  document.querySelector(".topBtn").addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // 게시물 삭제
  document
    .querySelector(".deleteBtn")
    .addEventListener("click", async function () {
      if (confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
        try {
          const response = await axios.post(
            "/board/post/delete",
            {
              id: postId,
            },
            {
              withCredentials: true,
            }
          );
          if (response.data.success) {
            alert(response.data.message);
            window.location.href = "/";
          } else {
            alert(response.data.message);
          }
        } catch (error) {
          if (error.response) {
            console.error("게시글 삭제 오류:", error.response.data.message);
            alert(`${error.response.data.message}`);
          } else {
            console.error("네트워크 오류:", error.message);
            alert("네트워크 오류가 발생했습니다.");
          }
        }
      }
    });
  // 게시물 수정
  document.querySelector(".fixBtn").addEventListener("click", function () {
    const postId = window.location.pathname.split("/").pop(); // URL에서 postId를 추출
    window.location.href = `/board/post/edit/${encodeURIComponent(postId)}`;
  });

  // pdf 파일 공유 버튼
  document
    .getElementById("download-pdf")
    .addEventListener("click", function () {
      const contentElement = document.querySelector(".contentWrapBox");

      const opt = {
        margin: 0,
        filename: "bakezy.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };

      html2pdf().from(contentElement).set(opt).save();
    });
  const sharePostBtn = document.querySelector(".sharePostBtn");

  sharePostBtn.addEventListener("click", function () {
    alert("신고 기능은 준비중입니다");
  });

  function restoreLikedPosts() {
    const likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || [];
    likedPosts.forEach((postId) => {
      const heartIcon = document.getElementById(`heartIcon-${postId}`);
      if (heartIcon) {
        heartIcon.classList.remove("fa-regular");
        heartIcon.classList.add("fa-solid");
      }
    });
  }
};

// 🔹 좋아요 기능
async function toggleLike(postId) {
  const heartIcon = document.getElementById(`heartIcon-${postId}`);
  const likeCountElement = document.querySelector(".detailLikeCount");

  if (!heartIcon || !likeCountElement) {
    console.error("좋아요 버튼 또는 숫자 요소를 찾을 수 없습니다.");
    return;
  }

  try {
    const response = await axios.post(
      `/board/postdetail/${postId}/like`,
      {},
      { withCredentials: true }
    );

    if (response.status === 200) {
      const { likeCount, liked } = response.data;
      console.log(liked, "liked");
      console.log(likeCount, "likeCount");
      heartIcon.classList.toggle("fa-solid", liked);

      heartIcon.classList.toggle("fa-regular", !liked);
      likeCountElement.textContent = likeCount;

      let likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || [];
      if (liked) {
        if (!likedPosts.includes(postId)) likedPosts.push(postId);
      } else {
        likedPosts = likedPosts.filter((id) => id !== postId);
      }
      localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
    }
  } catch (error) {
    console.error("좋아요 상태 업데이트 실패:", error);

    if (error.response?.status === 403) {
      alert("로그인 후 좋아요가 가능합니다. 로그인을 해주세요.");
      window.location.href = "/";
    }
  }
}
