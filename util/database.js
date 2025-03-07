const Sequelize = require('sequelize');
const sequelize = new Sequelize('expenses', 'root', '##aA12345', {
    dialect:'mysql',
    host: 'localhost'
});
module.exports= sequelize;