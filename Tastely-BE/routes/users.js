const express = require('express');
const router = express.Router();
const {
  getCurrentUser,
  uploadAvatar
} = require('../controllers/userController'); 

const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); 
const { register ,login} = require('../controllers/authController');


router.get('/me', authMiddleware, getCurrentUser);
router.post('/avatar', authMiddleware, upload.single('avatar'), uploadAvatar);
router.post('/register',register)
router.post('/login',login);

module.exports = router;