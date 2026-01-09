const { body, validationResult } = require('express-validator');

const validateSignup = [
    body('name')
        .isLength({ min: 3, max: 60 }).withMessage('Name must be between 3 and 60 characters'),
    body('email')
        .isEmail().withMessage('Invalid email format'),
    body('address')
        .isLength({ max: 400 }).withMessage('Address must not exceed 400 characters'),
    body('password')
        .isLength({ min: 6, max: 20 }).withMessage('Password must be between 6 and 20 characters'),
    body('role')
        .optional()
        .isIn(['User', 'StoreOwner']).withMessage('Invalid role selected'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

const validateStore = [
    body('name')
        .isLength({ min: 20, max: 60 }).withMessage('Store Name must be between 20 and 60 characters'),
    body('email')
        .isEmail().withMessage('Invalid email format'),
    body('address')
        .isLength({ max: 400 }).withMessage('Address must not exceed 400 characters'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

module.exports = { validateSignup, validateStore };
