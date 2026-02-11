const express = require('express');
const { getBugs, submitBugFix, getUserBalance } = require('../controllers/users.controller');
const { uploadFiles } = require('../middlewares/upload.middleware');

const router = express.Router();

router.get('/bugs', getBugs);
router.post('/submit-bug-fix', uploadFiles, submitBugFix);
router.get('/balance', getUserBalance);

module.exports = router;
