// const express = require("express");
// const router = express.Router();
// const {
//   createRecipe,
//   getAllRecipes,
//   getRecipeById,
//   updateRecipe,
//   deleteRecipe,
//   getUserRecipes,
//   toggleLikeRecipe,
//   getLikedRecipesByUser
// } = require("../controllers/recipeController");

// const authMiddleware = require("../middleware/authMiddleware");

// // Public
// router.get("/user/:userId",authMiddleware, getUserRecipes);
// router.get("/",authMiddleware, getAllRecipes);
// router.get("/:id",authMiddleware, getRecipeById);

// // Protected
// router.post("/",authMiddleware, createRecipe);
// router.put("/:id",authMiddleware, updateRecipe);
// // Compatibility route: frontend calls PUT /recipes/user/:id
// router.put("/user/:id",authMiddleware, updateRecipe);
// router.delete("/user/:id",authMiddleware, deleteRecipe);
// router.post("/:id/like",authMiddleware, toggleLikeRecipe);
// router.get("/liked/:userId",authMiddleware, getLikedRecipesByUser);



// module.exports = router;

// routes/recipeRoutes.js
const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");

// Create a new recipe
router.post("/", recipeController.createRecipe);

// Get all recipes (with filters: ingredients, cuisine, dietType, search query)
router.get("/", recipeController.getAllRecipes);

// Get a single recipe by ID
router.get("/:id", recipeController.getRecipeById);

// Update a recipe by ID
router.put("/:id", recipeController.updateRecipe);

// Delete a recipe by ID
router.delete("/:id", recipeController.deleteRecipe);

// Toggle like/unlike on a recipe
router.post("/:id/like", recipeController.toggleLikeRecipe);

// Get all recipes liked by a user
router.get("/recipes/liked/:userId", recipeController.getLikedRecipesByUser);

// Get all recipes created by a user
router.get("/user/:userId", recipeController.getUserRecipes);

module.exports = router;
