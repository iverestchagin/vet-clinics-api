const express = require('express');
const router = express.Router();

const middleware = require('../middleware/entities');

router.get('/', middleware.get);
router.post('/', middleware.post);
router.get('/:id', middleware.getById);
router.put('/:id', middleware.put);
router.delete('/:id', middleware.markDeleted);

module.exports = router;