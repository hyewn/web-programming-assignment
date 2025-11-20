var express = require('express');
var router = express.Router();
const store = require('../models/userStore');

router.get('/register', (req, res) => {
  res.render('register', { error: null });
});

router.get('/api/users/check', (req, res) => {
  const available = !store.existsId(req.query.id);
  res.json({ available });
});

router.post('/register', (req, res) => {
  const { id, pw1, pw2 } = req.body;
  if (store.existsId(id)) {
    return res.status(409).render('register', { error: '이미 존재하는 ID입니다.' });
  }
  if (pw1 !== pw2) {
    return res.status(400).render('register', { error: '비밀번호가 일치하지 않습니다.' });
  }
  store.addUser(id, pw1);
  return res.redirect('/login');
});

module.exports = router;
