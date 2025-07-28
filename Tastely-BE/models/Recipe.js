const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
  name: String,
  cookTime: Number,
  cuisine: String,
  dietType: String,
  createdBy: String,

  ingredients: [{}],
  instructions: [],
  imageUrl: String,
  prepTime: String,
  likes: String,
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  comments: [],
  nutrition: {},
});

module.exports = mongoose.model("Recipe", RecipeSchema);
