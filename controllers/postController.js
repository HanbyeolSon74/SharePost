const Post = require("../models/postModel"); // 예시로 모델을 가져옵니다.

module.exports = {
  board: (req, res) => res.render("board"),
  editBoard: (req, res) => res.render("editboard"),
  editPost: (req, res) => res.render("editpost"),
  main: (req, res) => res.render("main"),

  // 게시글 수정 페이지 (GET)
  editPostPage: async (req, res) => {
    const postId = req.params.id;

    try {
      const post = await Post.findByPk(postId); // 게시글 데이터를 DB에서 찾음
      if (!post) {
        return res.status(404).send("게시글을 찾을 수 없습니다.");
      }
      res.render("edit-post", { post }); // 수정 페이지에 기존 게시글 정보를 전달
    } catch (err) {
      console.error(err);
      res.status(500).send("서버 오류");
    }
  },

  // 게시글 수정 처리 (POST)
  updatePost: async (req, res) => {
    const { id, title, category, content, existingImage } = req.body;
    const image = req.file ? req.file.filename : existingImage;

    try {
      const post = await Post.findByPk(id); // 게시글 데이터를 DB에서 찾음
      if (!post) {
        return res.status(404).send("게시글을 찾을 수 없습니다.");
      }

      // 수정된 게시글 정보 저장
      await post.update({
        title,
        category,
        content,
        imageurl: image,
      });

      res.redirect(`/post/${id}`); // 수정된 게시글 페이지로 리디렉션 (예시: /post/{id})
    } catch (err) {
      console.error(err);
      res.status(500).send("서버 오류");
    }
  },
};
