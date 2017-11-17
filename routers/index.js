const express = require('express');
const router = express.Router();

const EntitiesRouter = require('./entities');
const ClinicsRouter = require('./clinics');
const ExportRouter = require('./export');
const ImportRouter = require('./import');

router.use('/legal-entities', EntitiesRouter);
router.use('/clinics', ClinicsRouter);
router.use('/export', ExportRouter);
router.use('/import', ImportRouter);

module.exports = router;