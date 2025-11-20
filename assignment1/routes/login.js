var express = require('express');
var router = express.Router();
const store = require('../models/userStore');

router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

router.post('/login', (req, res) => {
  const { id, pw } = req.body;
  const ok = store.matchUser(id, pw);
  if (!ok) {
    return res.status(401).render('login', { error: 'ID/PW가 올바르지 않습니다.' });
  }
  store.setLastLogin(id);
  return res.redirect('/home');
});

module.exports = router;
