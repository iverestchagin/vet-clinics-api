const express = require('express');
const router = express.Router();

const ClinicsRouter = require('./clinics');
const EntitiesRouter = require('./entities');
const ExportRouter = require('./export');

router.use('/clinics', ClinicsRouter);
router.use('/legal-entities', EntitiesRouter);
router.use('/export', ExportRouter);

module.exports = router;