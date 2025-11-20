const jwt = require('jsonwebtoken');

exports.sign = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    issuer: process.env.JWT_ISSUER || 'kw-a2',
  });

exports.verify = (token) => jwt.verify(token, process.env.JWT_SECRET);
