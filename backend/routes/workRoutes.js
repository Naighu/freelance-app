const express = require('express');
const { postWork,addCategory,getCategories,fetchAllWork,editWork ,deleteWork,applyWork} = require('../controllers/workController');
const { validateWorkMiddleware,validateAddCategoryiddleware,validateEditWorkMiddleware,validateDeleteWorkMiddleware,validateApplyWorkMiddleware } = require('../middleware/workMiddleware');
const { protect,protectAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/post',validateWorkMiddleware,protect, postWork);
router.post('/category/add',validateAddCategoryiddleware, protectAdmin,addCategory);
router.get('/category',getCategories);
router.get('/get',protect,fetchAllWork);
router.put('/update',protect,validateEditWorkMiddleware,editWork)
router.delete('/delete',protect,validateDeleteWorkMiddleware,deleteWork)
router.post('/apply',protect,validateApplyWorkMiddleware,applyWork)







module.exports = router;