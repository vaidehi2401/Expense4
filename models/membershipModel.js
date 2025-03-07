const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../util/database');
const User = require('./userModel');

const Membership = sequelize.define('Membership', {
    id: {
        type: DataTypes.UUID, // Using UUID for better security
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    membershipStatus: {
        type: DataTypes.ENUM('Pending', 'Success', 'Failure'),
        defaultValue: 'Pending', // Default status
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true, // Ensures a user can have only one membership
        references: {
            model: User,
            key: 'id'
        }
    }
}, {
    timestamps: false  
});

// One-to-One Relationship (One user can have only one membership)
User.hasOne(Membership, { foreignKey: 'userId', onDelete: 'CASCADE' });
Membership.belongsTo(User, { foreignKey: 'userId' });

module.exports = Membership;
