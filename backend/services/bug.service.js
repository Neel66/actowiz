const Bug = require('../models/Bug');
const Submission = require('../models/Submission');
const User = require('../models/User');
const { MESSAGES } = require('../constants/messages');
const { STATUS } = require('../constants/status');

const createBug = async (bugData, userId) => {
  try {
    const bug = new Bug({
      ...bugData,
      createdBy: userId,
    });
    await bug.save();
    return { success: true, message: MESSAGES.BUG_CREATED_SUCCESSFULLY, bug };
  } catch (error) {
    return { success: false, message: MESSAGES.BUG_CREATION_FAILED };
  }
};

const getBugsByCreator = async (userId) => {
  try {
    const bugs = await Bug.find({ createdBy: userId }).sort({ createdAt: -1 }).populate({
      path: 'submissions',
      populate: {
        path: 'submittedBy',
        select: 'name'
      }
    });
    return { success: true, bugs };
  } catch (error) {
    return { success: false, message: MESSAGES.INTERNAL_SERVER_ERROR };
  }
};

const allBugs = async () => {
  try {
    const bugs = await Bug.find().sort({ createdAt: -1 }).populate({
      path: 'submissions',
      populate: {
        path: 'submittedBy',
        select: 'name'
      }
    });
    return { success: true, bugs };
  } catch (error) {
    return { success: false, message: MESSAGES.INTERNAL_SERVER_ERROR };
  }
};

const createSubmission = async (submissionData, userId) => {
  try {
    const submission = new Submission({
      ...submissionData,
      submittedBy: userId,
    });
    await submission.save();
    return { success: true, message: MESSAGES.SUBMISSION_CREATED_SUCCESSFULLY, submission };
  } catch (error) {
    return { success: false, message: MESSAGES.SUBMISSION_CREATION_FAILED };
  }
};

const updateSubmissionStatus = async (submissionId, status, userId) => {
  try {
    const submission = await Submission.findById(submissionId).populate('bugId').populate('submittedBy');
    if (!submission) {
      return { success: false, message: MESSAGES.SUBMISSION_NOT_FOUND };
    }

    if (submission.bugId.createdBy.toString() !== userId) {
      return { success: false, message: MESSAGES.UNAUTHORIZED_UPDATE_SUBMISSION };
    }
    await Bug.findByIdAndUpdate(submission.bugId._id, { status: STATUS.CLOSED });

    await User.findByIdAndUpdate(submission.submittedBy._id, { $inc: { balance: submission.bugId.bountyAmount } });

    await Submission.findByIdAndUpdate(submissionId, { winner: true });

    return { success: true, message: MESSAGES.SUBMISSION_APPROVED_BUG_CLOSED, submission };
  } catch (error) {
    return { success: false, message: MESSAGES.INTERNAL_SERVER_ERROR };
  }
};

module.exports = {
  createBug,
  getBugsByCreator,
  allBugs,
  createSubmission,
  updateSubmissionStatus
};
