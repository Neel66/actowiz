const Bug = require('../models/Bug');
const { MESSAGES } = require('../constants/messages');

const createBug = async (bugData, userId) => {
  try {
    const bug = new Bug({
      ...bugData,
      createdBy: userId,
    });
    await bug.save();
    return { success: true, message: MESSAGES.BUG_CREATED_SUCCESSFULLY, bug };
  } catch (error) {
    console.error('Error creating bug:', error);
    return { success: false, message: MESSAGES.BUG_CREATION_FAILED };
  }
};

const getBugsByCreator = async (userId) => {
  try {
    const bugs = await Bug.find({ createdBy: userId }).sort({ createdAt: -1 });
    return { success: true, bugs };
  } catch (error) {
    console.error('Error fetching bugs:', error);
    return { success: false, message: MESSAGES.INTERNAL_SERVER_ERROR };
  }
};

module.exports = {
  createBug,
  getBugsByCreator,
};
