const Sequelize = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize(
    config.get('db:db'),
    config.get('db:username'),
    config.get('db:password'),
    {
        host: config.get('db:host'),
        dialect: 'mysql',
        operatorsAliases: false
    }
);

module.exports = sequelize;