const express = require('express');
const router = express.Router();
const { signup, login, updatePassword } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const { validateSignup } = require('../middleware/validationMiddleware');

router.post('/signup', validateSignup, signup);
router.post('/login', login);
router.put('/update-password', authenticate, updatePassword);

module.exports = router;
