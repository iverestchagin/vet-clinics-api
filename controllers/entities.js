const Entity = require('../models/entity');

async function list(offset, limit) {
    return Promise.all([
        Entity.findAll({
            offset,
            limit,
            attributes: {
                exclude: [
                    'deleted'
                ]
            }
        }),
        Entity.count()
    ]);
}

async function create(data) {
    // protect internal fields
    delete data.clinicsCount;
    delete data.deleted;

    return Entity.create(data);
}

async function get(id) {
    return Entity.unscoped().findById(id);
}

async function put(id, data) {
    // protect internal fields
    delete data.clinicsCount;
    delete data.deleted;

    let entity = Entity.build(data);
    await entity.validate();

    await Entity.update(data, {where: {id}});

    return get(id);
}

async function markDeleted(id) {
    let entity = await Entity.findById(id);

    if(!entity) {
        return null;
    }

    return Entity.update({
        deleted: true
    }, {where: {id}});
}

async function findByTitle(title) {
    return Entity.unscoped().findOne({
        where: {
            title
        }
    });
}

module.exports = {
    list,
    create,
    get,
    put,
    markDeleted,
    findByTitle
};