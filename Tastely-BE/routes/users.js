// routes/users.js
const express = require('express');
const router = express.Router();
const {
  getCurrentUser,
  uploadAvatar
} = require('../controllers/userController'); // We'll create this next

const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // Separate file for upload config

// Protected routes (require authentication)
router.get('/me', authMiddleware, getCurrentUser);
router.post('/avatar', authMiddleware, upload.single('avatar'), uploadAvatar);

module.exports = router;