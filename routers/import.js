const express = require('express');
const router = express.Router();

const middleware = require('../middleware/import');

router.get('/', middleware.get);
router.post('/', middleware.post);

module.exports = router;