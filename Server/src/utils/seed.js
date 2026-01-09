const { sequelize, User, Store, Rating } = require('../models');
const bcrypt = require('bcryptjs');

const seed = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('Database cleared and synced');

        const hashedPassword = await bcrypt.hash('Admin@123', 10);

        // Create Admin
        const admin = await User.create({
            name: 'System Administrator Account',
            email: 'admin@raxilor.com',
            password: hashedPassword,
            address: 'Main Headquarters, Tech City, USA',
            role: 'Admin'
        });
        console.log('Admin user created');

        // Create Store Owner
        const owner = await User.create({
            name: 'John Store Owner Senior',
            email: 'owner@raxilor.com',
            password: hashedPassword,
            address: '123 Business Avenue, Suite 100, Market District',
            role: 'StoreOwner'
        });
        console.log('Store owner created');

        // Create Normal User
        const user = await User.create({
            name: 'Regular Platform User Client',
            email: 'user@raxilor.com',
            password: hashedPassword,
            address: '789 Residential Street, Apartment 4B, Suburbia',
            role: 'User'
        });
        console.log('Normal user created');

        // Create Store
        const store = await Store.create({
            name: 'The Tech Gadgets Mega Store',
            email: 'contact@techmega.com',
            address: '456 Innovation Drive, Tech Park, Silicon Valley',
            ownerId: owner.id
        });
        console.log('Store created');

        // Add Rating
        await Rating.create({
            userId: user.id,
            storeId: store.id,
            rating: 5
        });
        console.log('Initial rating added');

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
};

seed();
