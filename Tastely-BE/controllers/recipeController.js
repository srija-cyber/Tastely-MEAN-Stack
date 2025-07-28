// Like or Unlike a recipe
exports.toggleLikeRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const userId = req.body.userId;
    const mongoose = require('mongoose');
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return res.status(404).json({ msg: "Recipe not found" });

    if (!Array.isArray(recipe.likedBy)) recipe.likedBy = [];
    const userObjId = userId;
    const index = recipe.likedBy.findIndex(id => id.toString() === userObjId.toString());
    if (index === -1) {
      // Not liked yet, add userId
      recipe.likedBy.push(userObjId);
    } else {
      // Already liked, remove userId
      recipe.likedBy.splice(index, 1);
    }
    await recipe.save();
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get all recipes liked by a user
exports.getLikedRecipesByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const mongoose = require('mongoose');
    const recipes = await Recipe.find({ likedBy:userId });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
const Recipe = require("../models/Recipe");

exports.createRecipe = async (req, res) => {
  try {
    const recipe = new Recipe({ ...req.body});
    const saved = await recipe.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getAllRecipes = async (req, res) => {
  try {
    // Start with an empty query object
    let query = {};

    // Handle ingredients filter (array of ingredients)
    if (req.query.ingredients) {
      const ingredients = Array.isArray(req.query.ingredients) 
        ? req.query.ingredients 
        : req.query.ingredients.split(',');
      query.ingredients = { $all: ingredients };
    }

    // Handle cuisine filter
    if (req.query.cuisine && req.query.cuisine !== 'All') {
      query.cuisine = req.query.cuisine;
    }

    // Handle diet type filter
    if (req.query.dietType) {
      query.dietType = req.query.dietType;
    }

    // Handle search query (dish name)
    if (req.query.query) {
      query.name = { $regex: req.query.query, $options: 'i' }; // Case-insensitive search
    }

    const recipes = await Recipe.find(query);
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Keep all your other existing methods unchanged
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ msg: "Recipe not found" });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    const updated = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ msg: "Recipe not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const deleted = await Recipe.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "Recipe not found" });
    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getUserRecipes = async (req, res) => {
  try {
    // Get userId from route parameter
    const userId = req.params.userId;
    const recipes = await Recipe.find({ createdBy:userId });
    res.json(recipes);
  } catch (err) {
    console.error(`Error fetching user recipes:`, err);
    res.status(500).json({ msg: err.message });
  }
};
