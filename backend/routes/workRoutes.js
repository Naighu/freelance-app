const express = require('express');
const { postWork,addCategory,getCategories,fetchAllWork } = require('../controllers/workController');
const { validateWorkMiddleware,validateAddCategoryiddleware } = require('../middleware/workMiddleware');
const { protect,protectAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/post',validateWorkMiddleware,protect, postWork);
router.post('/category/add',validateAddCategoryiddleware, protectAdmin,addCategory);
router.get('/category',getCategories);
router.get('/get',protect,fetchAllWork);





module.exports = router;