const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  title: String,
  imageUrl: String,
  shortDescription: String,
  fullContent: String,
  author: String,
  publishedDate: Date,
  categories: [String]
});

module.exports = mongoose.model("Blog", BlogSchema);
