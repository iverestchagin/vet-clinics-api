const ImportController = require('../controllers/import');

function get(req, res, next) {
    let perPage = Math.max(1, Math.min(500, parseInt(req.query['per-page']) || 50));
    let page = Math.max(1, parseInt(req.query.page) || 1);

    let limit = perPage;
    let offset = (page-1) * perPage;

    ImportController.list(offset, limit)
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
    ImportController.create(req.body)
        .then(({dataValues}) => {
            res.status(202);
            res.send(dataValues);
        })
        .catch(next);
}

module.exports = {
    get,
    post
};
