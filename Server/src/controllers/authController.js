const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

const signup = async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;

        let user = await User.findOne({ where: { email } });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = await User.create({ name, email, password: hashedPassword, address, role: role || 'User' });

        const payload = { id: user.id, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1d' });

        res.status(201).json({ token, user: { id: user.id, name, email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const payload = { id: user.id, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1d' });

        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findByPk(req.user.id);

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Current password incorrect' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { signup, login, updatePassword };
