const express = require('express');
const router = express.Router();
const { getDashboardStats, addUser, addStore, listStores, listUsers } = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { validateSignup, validateStore } = require('../middleware/validationMiddleware');

router.use(authenticate, authorize(['Admin']));

router.get('/dashboard', getDashboardStats);
router.post('/users', validateSignup, addUser);
router.post('/stores', validateStore, addStore);
router.get('/stores', listStores);
router.get('/users', listUsers);

module.exports = router;
