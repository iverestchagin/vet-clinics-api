const express = require('express');
const router = express.Router();

const middleware = require('../middleware/export');

router.get('/', middleware.get);

module.exports = router;