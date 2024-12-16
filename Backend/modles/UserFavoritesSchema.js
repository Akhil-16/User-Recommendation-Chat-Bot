const mongoose = require("mongoose");

const UserFavoritesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  favoriteImages: [
    {
      url: { type: String, required: true },
      addedAt: { type: Date, default: Date.now },
    },
  ],
});

const UserFavorites = mongoose.model("UserFavorites", UserFavoritesSchema);
module.exports = UserFavorites;
