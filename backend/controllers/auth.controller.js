const authService = require("../services/auth.service");
const { MESSAGES } = require("../constants/messages");

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    await authService.registerUser({ name, email, password, role });

    res.status(201).json({
      message: MESSAGES.USER_REGISTERED_SUCCESSFULLY,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { token } = await authService.loginUser({ email, password });

    res.status(200).json({
      message: MESSAGES.LOGIN_SUCCESSFUL,
      token,
    });
  } catch (error) {
    res
      .status(401)
      .json({ message: error.message || MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

module.exports = {
  register,
  login,
};
