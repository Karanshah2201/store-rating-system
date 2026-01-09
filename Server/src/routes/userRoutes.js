const express = require('express');
const router = express.Router();
const { getAllStoresForUser, submitRating } = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.use(authenticate, authorize(['User']));

router.get('/stores', getAllStoresForUser);
router.post('/rate', submitRating);

module.exports = router;
