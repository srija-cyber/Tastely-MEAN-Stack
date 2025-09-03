const express = require("express");
const router = express.Router();
const { getAllBlogs, getBlogCategories,getBlogById} = require("../controllers/blogController");
const authMiddleware = require("../middleware/authMiddleware");


router.get("/", getAllBlogs);

router.get("/categories", getBlogCategories);
router.get("/:id", getBlogById);

module.exports = router;
