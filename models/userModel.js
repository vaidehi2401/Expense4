const {Sequelize, DataTypes}= require('sequelize');
const sequelize = require('../util/database');
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    totalAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}
,
{
    timestamps: false  
}
)
module.exports=User;