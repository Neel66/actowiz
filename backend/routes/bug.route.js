const express = require('express');
const { createBugHandler, getBugsHandler } = require('../controllers/bug.controller');
const { authenticateToken } = require('../middlewares/auth.middleware'); // Assuming this exists
const { validateCreateBug } = require('../validations/bug.validation');

const router = express.Router();

router.post('/', authenticateToken, validateCreateBug, createBugHandler);

router.get('/', authenticateToken, getBugsHandler);

module.exports = router;
