const {Sequelize, DataTypes}= require('sequelize');
const sequelize = require('../util/database');
const Expense = sequelize.define('Expense', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING(600),
        allowNull: false
    },
    category: {
        type: DataTypes.STRING(45),
        allowNull: false
    }
}
,
{
    timestamps: false  
})
module.exports=Expense;