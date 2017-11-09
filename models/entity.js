const Sequelize = require('sequelize');
const db = require('../db');

const Clinic = require('./clinic');

const Entity = db.define('entity', {
    title: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    inn: Sequelize.STRING,
    clinicsCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
});

Clinic.belongsTo(Entity, {
    foreignKey: 'legalId'
});

module.exports = Entity;