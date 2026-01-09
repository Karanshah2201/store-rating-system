const { Store, Rating, User } = require('../models');

const getOwnerDashboard = async (req, res) => {
    try {
        const store = await Store.findOne({
            where: { ownerId: req.user.id },
            include: [
                {
                    model: Rating,
                    as: 'ratings',
                    include: [{ model: User, as: 'user', attributes: ['name', 'email'] }]
                }
            ]
        });

        if (!store) return res.status(404).json({ message: 'Store not found for this owner' });

        const avgRating = store.ratings.length
            ? (store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length).toFixed(1)
            : 0;

        const reviewers = store.ratings.map(r => ({
            name: r.user.name,
            email: r.user.email,
            rating: r.rating,
            date: r.updatedAt,
        }));

        res.json({
            storeName: store.name,
            averageRating: avgRating,
            reviewers: reviewers
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createStore = async (req, res) => {
    try {
        const { name, email, address } = req.body;

        // Check if owner already has a store
        const existingStore = await Store.findOne({ where: { ownerId: req.user.id } });
        if (existingStore) {
            return res.status(400).json({ message: 'You already have a store registered.' });
        }

        const store = await Store.create({
            name,
            email,
            address,
            ownerId: req.user.id
        });

        res.status(201).json({ message: 'Store created successfully', store });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getOwnerDashboard, createStore };
