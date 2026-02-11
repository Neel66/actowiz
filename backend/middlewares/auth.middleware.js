const jwt = require('jsonwebtoken');
const { MESSAGES } = require('../constants/messages');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: MESSAGES.ACCESS_TOKEN_REQUIRED });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: MESSAGES.INVALID_TOKEN });
    }
    req.user = user;
    next();
  });
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: MESSAGES.FORBIDDEN });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRole,
};
