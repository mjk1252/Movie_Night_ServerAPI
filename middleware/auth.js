const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const verify = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);

  if (!verify) {
    res.status(500).json({ msg: 'Authentication Timed out' });
    return;
  }

  next();
};

module.exports = auth;
