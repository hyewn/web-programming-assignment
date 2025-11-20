var express = require('express');
var router = express.Router();

const SUBMITTER_NAME = '김혜원';

router.get('/home', (req, res) => {
  res.render('home', { submitterName: SUBMITTER_NAME });
});

module.exports = router;
