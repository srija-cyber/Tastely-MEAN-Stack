const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");


router.post("/", recipeController.createRecipe);

router.get("/", recipeController.getAllRecipes);


router.get("/:id", recipeController.getRecipeById);


router.put("/:id", recipeController.updateRecipe);


router.delete("/:id", recipeController.deleteRecipe);


router.post("/:id/like", recipeController.toggleLikeRecipe);


router.get("/recipes/liked/:userId", recipeController.getLikedRecipesByUser);


router.get("/user/:userId", recipeController.getUserRecipes);

module.exports = router;
