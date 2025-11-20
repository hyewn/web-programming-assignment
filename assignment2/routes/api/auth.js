const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { run } = require('../../pgsql');
const requireAuth = require('../../middlewares/auth');

const router = express.Router();

const ITER = 120000, KEYLEN = 64, DIGEST = 'sha512';

function hashPw(pw, salt = crypto.randomBytes(16)) {
  const hash = crypto.pbkdf2Sync(pw, salt, ITER, KEYLEN, DIGEST);
  return { salt, hash };
}
function okPw(pw, salt, expected) {
  const { hash } = hashPw(pw, salt);
  return crypto.timingSafeEqual(hash, expected);
}
function sign(u) {
  return jwt.sign(
    { sub: u.id, username: u.username, realname: u.realname },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '30m', issuer: process.env.JWT_ISSUER || 'assignment2' }
  );
}

router.get('/check', async (req, res) => {
  const id = (req.query.id || '').trim();
  if (!id) return res.json({ available: false });
  const { rowCount } = await run('SELECT 1 FROM users WHERE username=$1', [id]);
  res.json({ available: rowCount === 0 });
});

router.post('/register', async (req, res) => {
  const { id, pw1, pw2, realname } = req.body || {};
  if (!id || !realname || !pw1 || pw1 !== pw2) return res.status(400).json({ message: 'invalid' });

  const dup = await run('SELECT 1 FROM users WHERE username=$1', [id]);
  if (dup.rowCount) return res.status(409).json({ message: 'duplicate' });

  const { salt, hash } = hashPw(pw1);
  const q = `
    INSERT INTO users (username, realname, pw_hash, pw_salt)
    VALUES ($1,$2,$3,$4)
    RETURNING id, username, realname
  `;
  const { rows } = await run(q, [id, realname, hash, salt]);
  const token = sign(rows[0]);
  res.json({ token });
});

router.post('/login', async (req, res) => {
  const { id, pw } = req.body || {};
  if (!id || !pw) return res.status(400).json({ message: 'invalid' });

  const r = await run('SELECT * FROM users WHERE username=$1', [id]);
  const u = r.rows[0];
  if (!u || !okPw(pw, u.pw_salt, u.pw_hash)) return res.status(401).json({ message: 'wrong' });

  const token = sign({ id: u.id, username: u.username, realname: u.realname });
  res.json({ token });
});

router.get('/me', requireAuth, (req, res) => {
  const { username, realname } = req.user;
  res.json({ username, realname });
});

module.exports = router;
