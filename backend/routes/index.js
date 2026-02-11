const express = require('express');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');
const { ROLES } = require('../constants/roles');

const router = express.Router();

router.use('/auth', require('./auth.route'));
router.use('/bugs', authenticateToken, authorizeRole([ROLES.BUG_CREATOR]), require('./bug.route'));
router.use('/users', authenticateToken, authorizeRole([ROLES.USER, ROLES.BUG_CREATOR]), require('./user.route'));

module.exports = router;
