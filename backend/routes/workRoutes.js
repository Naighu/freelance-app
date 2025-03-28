const express = require('express');
const { postWork } = require('../controllers/workController');
const { validateWorkMiddleware } = require('../middleware/workMiddleware');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/post',validateWorkMiddleware,protect, postWork);


module.exports = router;