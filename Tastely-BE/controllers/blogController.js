const Blog = require("../models/Blogs");

// @desc   Get all blogs
// @route  GET /blogs
// @access Public
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ publishedDate: -1 }); // latest first
    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: "Server error while fetching blogs" });
  }
};

const getBlogCategories = async (req, res) => {
  try {
    const categories = await Blog.distinct("categories");
    res.status(200).json(categories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc   Get a blog by ID
// @route  GET /blogs/:id
// @access Public
const getBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    if (!blog) {  
      return res.status(404).json({ message: "Blog not found" });
    } else {  
      res.status(200).json(blog);
    }
  } catch (error) {
    console.error("Error fetching blog by ID:", error);
    res.status(500).json({ message: "Server error while fetching blog" });
  }
}

module.exports = {
  getAllBlogs,
  getBlogCategories,
  getBlogById
};
