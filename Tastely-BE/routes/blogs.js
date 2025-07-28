const express = require("express");
const router = express.Router();
const { getAllBlogs, getBlogCategories,getBlogById} = require("../controllers/blogController");
const authMiddleware = require("../middleware/authMiddleware");

// GET /blogs - Get all blogs
router.get("/",authMiddleware, getAllBlogs);

// ✅ GET /blogs/categories - Get all unique categories
router.get("/categories",authMiddleware, getBlogCategories);
router.get("/:id",authMiddleware, getBlogById);

module.exports = router;
