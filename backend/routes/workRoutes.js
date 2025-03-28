const express = require('express');
const { postWork,addCategory,getCategories } = require('../controllers/workController');
const { validateWorkMiddleware,validateAddCategoryiddleware } = require('../middleware/workMiddleware');
const { protect,protectAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/post',validateWorkMiddleware,protect, postWork);
router.post('/category/add',validateAddCategoryiddleware, protectAdmin,addCategory);
router.get('/category',getCategories);




module.exports = router;