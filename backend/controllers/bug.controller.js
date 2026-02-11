const { createBug, getBugsByCreator } = require('../services/bug.service');
const { MESSAGES } = require('../constants/messages');

const createBugHandler = async (req, res) => {
  try {
    const { title, description, bountyAmount, isConfigurable, status } = req.body;
    const {userId} = req.user;
    const result = await createBug({ title, description, bountyAmount, isConfigurable, status }, userId);
    if (result.success) {
      res.status(201).json({ message: result.message, bug: result.bug });
    } else {
      res.status(500).json({ message: result.message });
    }
  } catch (error) {
    console.error('Error in createBugHandler:', error);
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
    console.error('Error in getBugsHandler:', error);
    res.status(500).json({ message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

module.exports = {
  createBugHandler,
  getBugsHandler,
};
