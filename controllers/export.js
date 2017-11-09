const Entity = require('../models/entity');
const Clinic = require('../models/clinic');

async function list() {
    return Clinic.findAll({
        where: {
            deleted: false
        },
        include: [{
            model: Entity,
            where: {
                deleted: false
            }
        }]
    });
}

module.exports = {
    list
};