const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(60),
        allowNull: false,
        validate: {
            len: [3, 60],
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING(400),
        allowNull: false,
        validate: {
            len: [0, 400],
        },
    },
    role: {
        type: DataTypes.ENUM('Admin', 'User', 'StoreOwner'),
        allowNull: false,
        defaultValue: 'User',
    },
});

module.exports = User;
