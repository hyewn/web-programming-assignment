const express = require('express');
const router = express.Router();

router.get('/', (_, res) => res.redirect('/login'));
router.get('/login',    (_, res) => res.render('login'));
router.get('/register', (_, res) => res.render('register'));
router.get('/home',     (_, res) => res.render('home', { submitter: process.env.SUBMITTER_NAME || '' }));

module.exports = router;
