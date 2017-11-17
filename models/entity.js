const Sequelize = require('sequelize');
const db = require('../db');

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
}, {
    defaultScope: {
        where: {
            deleted: false
        }
    },
    scopes: {
        test: {
            where: {
                deleted: true
            }
        }
    }
});

module.exports = Entity;