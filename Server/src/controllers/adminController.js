const { User, Store, Rating, sequelize } = require('../models');
const bcrypt = require('bcryptjs');

const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalStores = await Store.count();
        const totalRatings = await Rating.count();

        res.json({ totalUsers, totalStores, totalRatings });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const addUser = async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, address, role });
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const addStore = async (req, res) => {
    try {
        const { name, email, address, ownerId } = req.body;
        const store = await Store.create({ name, email, address, ownerId });
        res.status(201).json(store);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const listStores = async (req, res) => {
    try {
        const stores = await Store.findAll({
            include: [{ model: Rating, as: 'ratings', attributes: ['rating'] }],
        });

        const storeList = stores.map(store => {
            const avgRating = store.ratings.length
                ? (store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length).toFixed(1)
                : 0;
            return {
                id: store.id,
                name: store.name,
                email: store.email,
                address: store.address,
                rating: avgRating,
            };
        });

        res.json(storeList);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const listUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            where: req.query.role ? { role: req.query.role } : {},
            include: [{
                model: Store,
                as: 'store',
                include: [{ model: Rating, as: 'ratings', attributes: ['rating'] }]
            }],
        });

        const userList = users.map(user => {
            let rating = null;
            if (user.role === 'StoreOwner' && user.store) {
                const storeRatings = user.store.ratings;
                rating = storeRatings.length
                    ? (storeRatings.reduce((sum, r) => sum + r.rating, 0) / storeRatings.length).toFixed(1)
                    : 0;
            }
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                address: user.address,
                role: user.role,
                rating: rating,
            };
        });

        res.json(userList);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getDashboardStats, addUser, addStore, listStores, listUsers };
