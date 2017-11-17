const Sequelize = require('sequelize');
const Entity = require('./entity');
const db = require('../db');

const Clinic = db.define('clinic', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    navCode: Sequelize.STRING,
    crmCode: Sequelize.STRING,
    apartment: Sequelize.STRING,
    fias: Sequelize.STRING,
    zipcode: Sequelize.STRING,
    address: Sequelize.STRING,
    category: Sequelize.STRING,
    tradingChannel: Sequelize.STRING,
    clientType: Sequelize.STRING,
    signboard: Sequelize.STRING,
    longitude: Sequelize.STRING,
    latitude: Sequelize.STRING,
    square: Sequelize.STRING,
    referencePoint: Sequelize.STRING,
    schedule: Sequelize.STRING,
    url: Sequelize.STRING,
    phone: Sequelize.STRING,
    trustIndex: Sequelize.STRING,
    streebeeUpdatedAt: Sequelize.STRING,
    streetbeeCode: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    isDuplicate: Sequelize.STRING,
    refStreetbeeCode: Sequelize.STRING,
    dealer: Sequelize.STRING,
    shippedFrom: Sequelize.STRING,
    wholesaler: Sequelize.STRING,
    serviceTypeInFeedDept: Sequelize.STRING,
    streetbeeVerificationStatus: Sequelize.STRING,
    deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
}, {
    defaultScope: {
        where: {
            deleted: false
        },
        include: [Entity]
    }
});

Clinic.belongsTo(Entity, {
    foreignKey: 'legalId'
});

Clinic.belongsTo(Clinic, {
    foreignKey: 'mergedTo'
});

module.exports = Clinic;