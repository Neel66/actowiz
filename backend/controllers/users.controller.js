const { allBugs, createSubmission } = require('../services/bug.service');
const User = require('../models/User');
const { MESSAGES } = require('../constants/messages');

const getBugs = async (req, res) => {
  try {
    const result = await allBugs();
    if (result.success) {
      res.status(200).json({ bugs: result.bugs });
    } else {
      res.status(500).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

const submitBugFix = async (req, res) => {
  try {
    const { description, bugId } = req.body;
    const {userId} = req.user;

    if (!description || !bugId) {
      return res.status(400).json({ message: MESSAGES.BAD_REQUEST });
    }

    if (!req.files || req.files.length < 1 || req.files.length > 3) {
      return res.status(400).json({ message: 'At least 1 and at most 3 files are required' });
    }
    const proof = req.files.map(file => ({
      path: `/uploads/${file.filename}`,
      type: file.mimetype.startsWith('image/') ? 'image' :
            file.mimetype.startsWith('video/') ? 'video' : 'file',
      originalName: file.originalname
    }));

    const result = await createSubmission({ description, proof, bugId }, userId);
    if (result.success) {
      res.status(201).json({ message: result.message, submission: result.submission });
    } else {
      res.status(500).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

const getUserBalance = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId).select('balance');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ balance: `₹${user.balance}` });
  } catch (error) {
    res.status(500).json({ message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

module.exports = {
  getBugs,
  submitBugFix,
  getUserBalance,
};
