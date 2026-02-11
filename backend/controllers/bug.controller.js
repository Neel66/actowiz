const { createBug, getBugsByCreator, updateSubmissionStatus } = require('../services/bug.service');
const { MESSAGES } = require('../constants/messages');
const {STATUS}=require('../constants/status');

const createBugHandler = async (req, res) => {
  try {
    const { title, description, bountyAmount, isConfigurable } = req.body;
    const {userId} = req.user;
    const result = await createBug({ title, description, bountyAmount, isConfigurable, status: STATUS.OPEN }, userId);
    if (result.success) {
      res.status(201).json({ message: result.message, bug: result.bug });
    } else {
      res.status(500).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

const getBugsHandler = async (req, res) => {
  try {
    const {userId} = req.user;
    const result = await getBugsByCreator(userId);
    if (result.success) {
      res.status(200).json({ bugs: result.bugs });
    } else {
      res.status(500).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

const updateSubmissionStatusHandler = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { status } = req.body;
    const { userId } = req.user;
    const result = await updateSubmissionStatus(submissionId, status, userId);
    if (result.success) {
      res.status(200).json({ message: result.message, submission: result.submission });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

module.exports = {
  createBugHandler,
  getBugsHandler,
  updateSubmissionStatusHandler,
};
