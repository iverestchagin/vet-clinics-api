const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Import = require('../models/import');

async function list(offset, limit) {
    return Promise.all([
        Import.findAll({
            offset,
            limit
        }),
        Import.count()
    ]);
}

async function create(data) {
    return Import.create({
        source_url: data.source_url
    });
}

async function save(item) {
    await item.save();

    return item;
}

async function findOneToFetch() {
    return Import.findOne({
        where: {
            status: {
                [Op.in]: [
                    'NEW',
                    'FETCHING'
                ]
            }
        }
    });
}

async function findOneToProcess() {
    return Import.findOne({
        where: {
            status: 'FETCHED'
        }
    });
}

module.exports = {
    list,
    create,
    save,
    findOneToFetch,
    findOneToProcess
};