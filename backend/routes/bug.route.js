const express = require('express');
const { createBugHandler, getBugsHandler, updateSubmissionStatusHandler } = require('../controllers/bug.controller');
const { validateCreateBug } = require('../validations/bug.validation');

const router = express.Router();

router.post('/', validateCreateBug, createBugHandler);

router.get('/', getBugsHandler);

router.put('/submissions/:submissionId/status', updateSubmissionStatusHandler);

module.exports = router;
