const http = require('http');
const URL = require('url');
const config = require('../config');
const ClinicsController = require('../controllers/clinics');

function get(req, res, next) {
    let perPage = Math.max(1, Math.min(500, parseInt(req.query['per-page']) || 50));
    let page = Math.max(1, parseInt(req.query.page) || 1);

    let limit = perPage;
    let offset = (page-1) * perPage;

    ClinicsController.list(offset, limit)
        .then(([clinics, itemsCount]) => {
            res.status(200);
            res.set('X-Pagination-Per-Page', perPage);
            res.set('X-Pagination-Current-Page', page);
            res.set('X-Pagination-Total-Items', itemsCount);
            res.set('X-Pagination-Total-Pages', Math.ceil(itemsCount / perPage));
            res.send(clinics);
        })
        .catch(next);
}

function post(req, res, next) {        
    ClinicsController.create(req.body)
        .then(clinic => {
            delete clinic.dataValues.deleted;
            res.status(201);
            res.send(clinic.dataValues);

            let mergeList = req.query.mergeList;
            if(mergeList && mergeList.length) {
                mergeList = mergeList.split(',').map(e => parseInt(e)).filter(e => e > 0);
                return ClinicsController.merge(clinic, mergeList);
            }
        })
        .then(([clinic, mergeList]) => {
            let report = {
                mergeList,
                clinic: clinic.toJSON()
            };

            let webhook = config.get('onMergeWebhookURL');

            if(webhook) {
                let data = JSON.stringify(report);

                let url = URL.parse(webhook);

                let request = http.request({
                    hostname: url.hostname,
                    port: url.port,
                    path: url.path,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(data)
                    }
                });
                
                request.on('error', (err) => {
                    console.error('Error calling webhook\n', err);
                });
            
                request.write(data);
                request.end();
            }

            report.date = new Date();
            console.log('Clinics merged.\n', report);
        })
        .catch(err => {
            switch(err.name) {
            case 'SequelizeUniqueConstraintError':
                res.status(409);
                break;

            case 'SequelizeValidationError':
                res.status(422);
                break;

            default:
                next(err);
                return;
            }

            res.end();
        });
}

function getById(req, res, next) {
    ClinicsController.get(parseInt(req.params.id))
        .then(clinic => {
            if(!clinic) {
                res.status(404);
            } else if(clinic.deleted || clinic.entity.deleted) {
                res.status(410);
            } else {
                delete clinic.dataValues.deleted;
                res.status(200);
                res.send(clinic.dataValues);
            }
            res.end();
        })
        .catch(next);
}

function put(req, res, next) {
    ClinicsController.put(parseInt(req.params.id), req.body)
        .then(clinic => {
            if(clinic) {
                if(clinic.deleted || clinic.entity.deleted) {
                    res.status(410);
                } else {
                    delete clinic.dataValues.deleted;
                    delete clinic.dataValues.entity.dataValues.deleted;

                    res.status(200);
                    res.send(clinic);
                }
            } else {
                res.status(404);
            }

            res.end();
        })
        .catch(err => {
            switch(err.name) {
            case 'SequelizeUniqueConstraintError':
                res.status(409);
                break;
    
            case 'SequelizeValidationError':
                res.status(422);
                break;

            case 'Clinic deleted while validating':
                res.status(410);
                break;

            default:
                next(err);
                return;
            }

            res.end();
        });
}

function markDeleted(req, res, next) {
    ClinicsController.markDeleted(parseInt(req.params.id))
        .then(() => {
            res.status(204);
            res.end();
        })
        .catch(err => {
            switch(err.name) {
            case 'Nonexistent clinic':
                res.status(404);
                break;
    
            case 'Deleted clinic':
                res.status(410);
                break;

            default:
                next(err);
                return;
            }

            res.end();
        });
}

module.exports = {
    get,
    post,
    getById,
    put,
    markDeleted
};
