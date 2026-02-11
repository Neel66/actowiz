const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.route'));
router.use('/bugs', require('./bug.route'));

module.exports = router;
