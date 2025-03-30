const express = require('express');
const { postWork,addCategory,getCategories,fetchAllWork,editWork ,deleteWork,applyWork,fetchWorkById} = require('../controllers/workController');
const { validateWorkMiddleware,validateAddCategoryiddleware,validateEditWorkMiddleware,validateDeleteWorkMiddleware,validateApplyWorkMiddleware } = require('../middleware/workMiddleware');
const { protect,protectAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/post',validateWorkMiddleware,protect, postWork);
router.post('/category/add',validateAddCategoryiddleware, protectAdmin,addCategory);
router.get('/category',getCategories);
router.get('/get/all',protect,fetchAllWork);

router.get('/get/:id',protect,fetchWorkById);

router.put('/update',protect,validateEditWorkMiddleware,editWork)
router.delete('/delete',protect,validateDeleteWorkMiddleware,deleteWork)
router.post('/apply',protect,validateApplyWorkMiddleware,applyWork)







module.exports = router;