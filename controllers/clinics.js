const Sequelize = require('sequelize');
const db = require('../db');
const Entity = require('../models/entity');
const Clinic = require('../models/clinic');

async function list(offset, limit) {
    return Promise.all([
        Clinic.findAll({
            where: {
                deleted: false
            },
            offset,
            limit,
            attributes: {
                exclude: [
                    'deleted',
                    'legalId'
                ]
            },
            include: [{
                model: Entity,
                where: {
                    deleted: false
                },
                attributes: {
                    exclude: [
                        'deleted',
                        'clinicsCount'
                    ]
                }
            }]
        }),
        Clinic.count({
            where: {
                deleted: false
            },
            include: [{
                model: Entity,
                where: {
                    deleted: false
                }
            }]
        })
    ]);
}

async function create(data) {
    delete data.deleted;

    let entity = await Entity.findOne({
        where: {
            id: data.legalId,
            deleted: false
        }
    });

    if(!entity) {
        throw {name: 'SequelizeValidationError'};
    }

    return db.transaction(transaction => {
        return entity.increment({clinicsCount: 1}, {transaction, silent: true})
            .then(() => {
                return Clinic.create(data, {transaction});
            });
    });
}

async function merge(clinic, ids) {
    let clinics = await Clinic.findAll({
        where: {
            id: {
                [Sequelize.Op.in]: ids
            },
            deleted: false
        },
        include: [Entity]
    });

    return db.transaction(transaction => {
        let promises = clinics.map(e => e.entity.decrement({clinicsCount: 1}, {transaction})); // soso

        return Promise.all(promises)
            .then(() => {
                return Clinic.update({
                    deleted: true,
                    mergedTo: clinic.id
                }, {
                    where: {
                        id: {
                            [Sequelize.Op.in]: ids
                        },
                        deleted: false
                    },        
                    transaction
                });
            });
    })
        .then(() => {
            return Promise.all([
                get(clinic.id),
                clinics.map(e => e.id)
            ]);
        });
}

async function get(id) {
    return Clinic.findOne({
        where: {id},
        attributes: {
            exclude: [
                'legalId'
            ]
        },
        include: [{
            model: Entity,
            attributes: {
                exclude: [
                    'clinicsCount'
                ]
            }
        }]
    });
}

async function put(id, data) {
    let clinic = await get(id);
    
    if(clinic.deleted || clinic.entity.deleted) {
        return clinic;
    }

    // protect internal field
    delete data.deleted;

    let stub = Clinic.build(data);
    await stub.validate();

    let entity = await Entity.findOne({
        where: {
            id: data.legalId,
            deleted: false
        }
    });

    if(!entity) {
        throw {name: 'SequelizeValidationError'};
    }

    await db.transaction(transaction => {
        return Clinic.update(data, {where: {id, deleted: false}, transaction})
            .then(([affected]) => {
                if(!affected) { // Still it is possible that linked entity is deleted 
                    throw {name: 'Clinic deleted while validating'};
                }
            
                return Promise.all([
                    clinic.entity.decrement({clinicsCount: 1}, {transaction, silent: true}),
                    entity.increment({clinicsCount: 1}, {transaction, silent: true})
                ]);
            });
    });

    return get(id);
}

async function markDeleted(id) {
    let clinic = await Clinic.findOne({
        where: {id},
        include: [Entity]
    });

    if(!clinic) {
        throw {name: 'Nonexistent clinic'};
    }

    if(clinic.deleted || clinic.entity.deleted) {
        throw {name: 'Deleted clinic'};
    }

    return db.transaction(transaction => {
        return clinic.entity.decrement({clinicsCount: 1}, {transaction, silent: true})
            .then(() => {
                return Clinic.update({
                    deleted: true
                }, {
                    where: {
                        id,
                        deleted: false
                    }
                });
            })
            .then(([affected]) => {
                if(!affected) {
                    throw {name: 'Deleted clinic'};
                }
            });
    });
}

module.exports = {
    list,
    create,
    merge,
    get,
    put,
    markDeleted
};