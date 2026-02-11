const authService = require('../services/auth.service');
const { MESSAGES } = require('../constants/messages');

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password, role } = req.body;

      const user = await authService.registerUser({ name, email, password, role });

      res.status(201).json({
        message: MESSAGES.USER_REGISTERED_SUCCESSFULLY,
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: error.message || MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const { token } = await authService.loginUser({ email, password });

      res.status(200).json({
        message: MESSAGES.LOGIN_SUCCESSFUL,
        token
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({ message: error.message || MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
}

module.exports = new AuthController();
