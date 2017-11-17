const EntitiesController = require('../controllers/entities');

function get(req, res, next) {
    let perPage = Math.max(1, Math.min(500, parseInt(req.query['per-page']) || 50));
    let page = Math.max(1, parseInt(req.query.page) || 1);

    let limit = perPage;
    let offset = (page-1) * perPage;

    EntitiesController.list(offset, limit)
        .then(([entities, itemsCount]) => {
            res.status(200);
            res.set('X-Pagination-Per-Page', perPage);
            res.set('X-Pagination-Current-Page', page);
            res.set('X-Pagination-Total-Items', itemsCount);
            res.set('X-Pagination-Total-Pages', Math.ceil(itemsCount / perPage));
            res.send(entities);
        })
        .catch(next);
}

function post(req, res, next) {
    EntitiesController.create(req.body)
        .then(({dataValues}) => {
            delete dataValues.deleted;
            res.status(201);
            res.send(dataValues);
        })
        .catch(next);
}

function getById(req, res, next) {
    EntitiesController.get(parseInt(req.params.id))
        .then(entity => {
            if(!entity) {
                res.status(404);
            } else if(entity.deleted) {
                res.status(410);
            } else {
                delete entity.dataValues.deleted;
                res.status(200);
                res.send(entity.dataValues);
            }
            res.end();
        })
        .catch(next);
}

function put(req, res, next) {
    EntitiesController.put(parseInt(req.params.id), req.body)
        .then(entity => {
            if(entity) {
                if(entity.deleted) {
                    res.status(410);
                } else {
                    delete entity.dataValues.deleted;
                    res.status(200);
                    res.send(entity.dataValues);
                }
            } else {
                res.status(404);
            }

            res.end();
        })
        .catch(next);
}

function markDeleted(req, res, next) {
    EntitiesController.markDeleted(parseInt(req.params.id))
        .then(affected => {
            if(!affected) {
                res.status(404);
            } else if(affected[0] == 0) {
                res.status(410);
            } else {
                res.status(204);
            }
            res.end();
        })
        .catch(next);
}

module.exports = {
    get,
    post,
    getById,
    put,
    markDeleted
};
