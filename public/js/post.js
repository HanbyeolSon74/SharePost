// postPage.js
window.onload = async function () {
  document.querySelector(".contentWrapBox").innerHTML = `
  <div class="postContentAllWrap">
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
  </div>
`;

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
  try {
    const response = await axios.get(`/board/post/${postId}`);

    if (response.status === 200) {
      const post = response.data.post;

      const formattedDate = formatDate(post.updatedAt);
      document.getElementById("postTitle").textContent = post.title;
      // document.querySelector(".userImage").src= post.userImage;
      document.querySelector(".userId").textContent = post.userId;
      document.querySelector(".postDate").textContent = formattedDate;
      document.querySelector(
        ".postlikeBtn"
      ).innerHTML = `<div class="likeCircle">
  
    <i class="fa-regular fa-heart" id="heartIcon-${post.userId}"></i>
  
</div>`;

      document.getElementById("postContent").innerHTML = `${post.content}`;
      document.getElementById("postMainImage").src =
        post.mainimage || "/images/default.jpg";
      console.log(window.FontAwesome);
      if (window.FontAwesome) {
        window.FontAwesome.dom.i2svg();
      }
      console.log(window.FontAwesome);
    }
  } catch (error) {
    console.error("게시물 로딩 오류:", error);
    alert("게시물 데이터를 가져오는 중 오류가 발생했습니다.");
  }
};
