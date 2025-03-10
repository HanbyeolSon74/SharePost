// controllers/favoriteController.js
const { Favorite } = require("../models");

module.exports = {
  getFavorites: async (req, res) => {
    try {
      const favorites = await Favorite.findAll();
      res.render("favorite", { favorites });
    } catch (error) {
      console.error(error);
      res.status(500).send("서버 오류");
    }
  },
};
