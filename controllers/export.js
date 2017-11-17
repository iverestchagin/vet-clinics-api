const Clinic = require('../models/clinic');

async function list() {
    return Clinic.findAll();
}

module.exports = {
    list
};