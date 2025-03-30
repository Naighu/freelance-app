
const express = require('express');
const { registerUser, loginUser, updateUserProfile, getProfile } = require('../controllers/authController');
const { protect,validateUpdateProfileMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.put('/profile', validateUpdateProfileMiddleware,protect, updateUserProfile);

module.exports = router;
