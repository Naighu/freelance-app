const express = require('express');
const { postWork } = require('../controllers/workController');
const { validateWorkMiddleware } = require('../middleware/workMiddleware');
const router = express.Router();

router.post('/post',validateWorkMiddleware, postWork);


module.exports = router;