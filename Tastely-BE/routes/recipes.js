const express = require("express");
const router = express.Router();
const {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  getUserRecipes,
  toggleLikeRecipe,
  getLikedRecipesByUser
} = require("../controllers/recipeController");

const authMiddleware = require("../middleware/authMiddleware");

// Public
router.get("/user/:userId",authMiddleware, getUserRecipes);
router.get("/",authMiddleware, getAllRecipes);
router.get("/:id",authMiddleware, getRecipeById);

// Protected
router.post("/",authMiddleware, createRecipe);
router.put("/:id",authMiddleware, updateRecipe);
router.delete("/user/:id",authMiddleware, deleteRecipe);
router.post("/:id/like",authMiddleware, toggleLikeRecipe);
router.get("/liked/:userId",authMiddleware, getLikedRecipesByUser);



module.exports = router;
