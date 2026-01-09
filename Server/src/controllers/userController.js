const { Store, Rating, User } = require('../models');

const getAllStoresForUser = async (req, res) => {
    try {
        const stores = await Store.findAll({
            include: [
                { model: Rating, as: 'ratings' },
            ],
        });

        const results = stores.map(store => {
            const userRatingObj = store.ratings.find(r => r.userId === req.user.id);

            const total = store.ratings.reduce((sum, r) => sum + r.rating, 0);
            const count = store.ratings.length;
            const avgRating = count > 0 ? (total / count).toFixed(1) : "0.0";

            return {
                id: store.id,
                name: store.name,
                address: store.address,
                overallRating: avgRating,
                userSubmittedRating: userRatingObj ? userRatingObj.rating : null,
            };
        });

        res.json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const submitRating = async (req, res) => {
    try {
        const { storeId, rating } = req.body;
        const userId = req.user.id;

        let existingRating = await Rating.findOne({ where: { storeId, userId } });

        if (existingRating) {
            existingRating.rating = rating;
            await existingRating.save();
        } else {
            await Rating.create({ storeId, userId, rating });
        }

        res.json({ message: 'Rating submitted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getAllStoresForUser, submitRating };
