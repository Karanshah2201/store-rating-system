const express = require('express');
const router = express.Router();
const { getOwnerDashboard, createStore } = require('../controllers/ownerController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.get('/dashboard', authenticate, authorize(['StoreOwner']), getOwnerDashboard);
router.post('/store', authenticate, authorize(['StoreOwner']), createStore);

module.exports = router;
