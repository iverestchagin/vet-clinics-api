const Sequelize = require('sequelize');
const Entity = require('./entity');
const Clinic = require('./clinic');
const db = require('../db');

const Import = db.define('import', {
    source_url: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    pid: Sequelize.STRING,
    rawData: Sequelize.TEXT,
    rowsCount: Sequelize.INTEGER,
    legalEntitiesCount: Sequelize.INTEGER,
    status: {
        type: Sequelize.ENUM(
            'NEW',
            'FETCHING',
            'FETCHED',
            'STARTED',
            'FINISHED',
            'FAILED'
        ),
        defaultValue: 'NEW',
        allowNull: false
    },
    failReason: Sequelize.TEXT,
    fetchedAt: Sequelize.DATE,
    startedAt: Sequelize.DATE,
    finishedAt: Sequelize.DATE
}, {
    defaultScope: {
        order: Sequelize.col('createdAt')
    }
});

const ImportEntity = db.define('import_entity', { }, {timestamps: false});
Import.belongsToMany(Entity, {through: ImportEntity});

const ImportClinic = db.define('import_clinic', { }, {timestamps: false});
Import.belongsToMany(Clinic, {through: ImportClinic});

module.exports = Import;