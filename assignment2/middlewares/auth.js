const jwt = require('jsonwebtoken');

module.exports = function requireAuth(req, res, next) {
  const h = req.headers.authorization || '';
  if (!h.startsWith('Bearer ')) return res.status(401).json({ message: 'No token' });
  try {
    req.user = jwt.verify(h.slice(7), process.env.JWT_SECRET);
    return next();
  } catch (e) {
    const code = e.name === 'TokenExpiredError' ? 419 : 401;
    return res.status(code).json({ message: 'Invalid token' });
  }
};
