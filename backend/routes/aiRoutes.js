const express = require('express');
const router = express.Router();
const { getCareerAdvice } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// Route to get career advice (requires authentication)
router.post('/advise', getCareerAdvice);

module.exports = router;
