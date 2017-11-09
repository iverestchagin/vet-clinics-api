const express = require('express');
const router = express.Router();

const ClinicsRouter = require('./clinics');
const EntitiesRouter = require('./entities');

router.use('/clinics', ClinicsRouter);
router.use('/legal-entities', EntitiesRouter);

module.exports = router;